import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
    IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
    OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
    LOW: { background: "bg-red-100 dark:bg-red-950", prioritycolor: "text-red-600 dark:text-red-400" },
    MEDIUM: { background: "bg-blue-100 dark:bg-blue-950", prioritycolor: "text-blue-600 dark:text-blue-400" },
    HIGH: { background: "bg-emerald-100 dark:bg-emerald-950", prioritycolor: "text-emerald-600 dark:text-emerald-400" },
};

const ProjectTasks = ({ tasks }) => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => 
            t.assignee?.name || t.assignee?.email?.split('@')[0] || "Unassigned"
        ).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            const taskAssigneeName = task.assignee?.name || task.assignee?.email?.split('@')[0] || "Unassigned";
            
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || taskAssigneeName === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = await getToken();
            toast.loading("Updating status...");
            
            await api.put(`/api/tasks/${taskId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            let updatedTask = structuredClone(tasks.find((t) => t.id === taskId));
            updatedTask.status = newStatus;
            dispatch(updateTask(updatedTask));

            toast.dismiss();
            toast.success("Task status updated successfully");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete the selected tasks?")) return;

            const token = await getToken();
            toast.loading("Deleting tasks...");
            await api.post("/api/tasks/delete", { taskIds: selectedTasks }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(deleteTask(selectedTasks));
            setSelectedTasks([]);
            toast.dismiss();
            toast.success("Tasks deleted successfully");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-4">
                {["status", "type", "priority", "assignee"].map((name) => {
                    const options = {
                        status: [
                            { label: "All Statuses", value: "" },
                            { label: "To Do", value: "TODO" },
                            { label: "In Progress", value: "IN_PROGRESS" },
                            { label: "Done", value: "DONE" },
                        ],
                        type: [
                            { label: "All Types", value: "" },
                            { label: "Task", value: "TASK" },
                            { label: "Bug", value: "BUG" },
                            { label: "Feature", value: "FEATURE" },
                            { label: "Improvement", value: "IMPROVEMENT" },
                            { label: "Other", value: "OTHER" },
                        ],
                        priority: [
                            { label: "All Priorities", value: "" },
                            { label: "Low", value: "LOW" },
                            { label: "Medium", value: "MEDIUM" },
                            { label: "High", value: "HIGH" },
                        ],
                        assignee: [
                            { label: "All Assignees", value: "" },
                            ...assigneeList.map((n) => ({ label: n, value: n })),
                        ],
                    };
                    return (
                        <select key={name} name={name} value={filters[name]} onChange={handleFilterChange} className="border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 outline-none px-3 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                            {options[name].map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    );
                })}

                {(filters.status || filters.type || filters.priority || filters.assignee) && (
                    <button onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })} className="px-3 py-1 flex items-center gap-2 rounded bg-zinc-200 dark:bg-zinc-800 text-sm">
                        <XIcon className="size-3" /> Reset
                    </button>
                )}

                {selectedTasks.length > 0 && (
                    <button onClick={handleDelete} className="px-3 py-1 flex items-center gap-2 rounded bg-red-500 text-white text-sm">
                        <Trash className="size-3" /> Delete ({selectedTasks.length})
                    </button>
                )}
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-300 dark:border-zinc-800">
                <div className="w-full">
                    {/* Desktop View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full text-sm text-left bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300">
                            <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400">
                                <tr>
                                    <th className="pl-4 py-3 w-10">
                                        <input 
                                            type="checkbox" 
                                            onChange={() => selectedTasks.length === filteredTasks.length ? setSelectedTasks([]) : setSelectedTasks(filteredTasks.map(t => t.id))}
                                            checked={selectedTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                                            className="size-3 accent-zinc-600" 
                                        />
                                    </th>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Assignee</th>
                                    <th className="px-4 py-3">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        const isDone = task.status === "DONE";
                                        const { icon: Icon, color } = typeIcons[task.type] || {};
                                        const { background, prioritycolor } = priorityTexts[task.priority] || {};

                                        return (
                                            <tr 
                                                key={task.id} 
                                                onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)} 
                                                className={`border-t border-zinc-300 dark:border-zinc-800 transition-all cursor-pointer
                                                    ${isDone 
                                                        ? "bg-emerald-50/40 dark:bg-emerald-900/10 opacity-70" 
                                                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                    }`}
                                            >
                                                <td onClick={e => e.stopPropagation()} className="pl-4 py-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedTasks.includes(task.id)}
                                                        onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter(id => id !== task.id)) : setSelectedTasks([...selectedTasks, task.id])}
                                                        className="size-3 accent-zinc-600" 
                                                    />
                                                </td>
                                                <td className={`px-4 py-2 font-medium ${isDone ? "line-through text-zinc-500" : ""}`}>
                                                    {task.title}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        {Icon && <Icon className={`size-4 ${color}`} />}
                                                        <span className={`uppercase text-[10px] font-bold ${color}`}>{task.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400" : `${background} ${prioritycolor}`}`}>
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td onClick={e => e.stopPropagation()} className="px-4 py-2">
                                                    <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} className="bg-transparent outline-none text-sm cursor-pointer font-medium">
                                                        <option value="TODO">To Do</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="DONE">Done</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <img 
                                                            src={task.assignee?.image || `https://ui-avatars.com/api/?name=${task.assignee?.email || 'U'}&background=random`} 
                                                            className={`size-6 rounded-full border border-zinc-200 dark:border-zinc-700 ${isDone ? "grayscale" : ""}`} 
                                                            alt="" 
                                                        />
                                                        <span className="truncate max-w-[100px]">
                                                            {task.assignee?.name || task.assignee?.email?.split('@')[0] || "Unassigned"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-zinc-500 whitespace-nowrap">
                                                    {format(new Date(task.due_date), "dd MMM")}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="7" className="p-10 text-center text-zinc-400">No tasks match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden p-4 flex flex-col gap-4 bg-zinc-50 dark:bg-transparent">
                        {filteredTasks.map((task) => {
                            const isDone = task.status === "DONE";
                            return (
                                <div 
                                    key={task.id} 
                                    className={`rounded-xl p-4 shadow-sm border transition-all
                                        ${isDone 
                                            ? "bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50 opacity-75" 
                                            : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 shadow-sm"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`font-semibold ${isDone ? "line-through text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                                            {task.title}
                                        </h3>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedTasks.includes(task.id)}
                                            onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter(id => id !== task.id)) : setSelectedTasks([...selectedTasks, task.id])}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1 px-2 rounded font-bold ${isDone ? "bg-zinc-100 text-zinc-400" : priorityTexts[task.priority]?.background}`}>
                                                {task.priority}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400">{task.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end">
                                            <img src={task.assignee?.image || `https://ui-avatars.com/api/?name=${task.assignee?.email}`} className={`size-5 rounded-full ${isDone ? "grayscale" : ""}`} />
                                            <span className={isDone ? "text-zinc-400" : ""}>{task.assignee?.name || "Unassigned"}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;
