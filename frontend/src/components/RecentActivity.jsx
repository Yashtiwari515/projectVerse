import { useEffect, useState } from "react";
import { GitCommit, MessageSquare, Clock, Bug, Zap, Square } from "lucide-react";
import { format, isValid } from "date-fns";
import { useSelector } from "react-redux";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
    IMPROVEMENT: { icon: MessageSquare, color: "text-amber-500 dark:text-amber-400" },
    OTHER: { icon: GitCommit, color: "text-purple-500 dark:text-purple-400" },
};

const statusColors = {
    TODO: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    DONE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500",
    COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    useEffect(() => {
        if (currentWorkspace?.projects) {
            // 1. Saare projects se tasks nikaalna
            const allTasks = currentWorkspace.projects.flatMap(
                (project) => project.tasks || []
            );

            // 2. Sorting: Jo task sabse pehle update hua (updatedAt), wo sabse upar
            const sortedTasks = allTasks.sort((a, b) => 
                new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
            );

            // 3. Limit: Sirf top 10 recent activities dikhao
            setTasks(sortedTasks.slice(0, 10));
        } else {
            setTasks([]);
        }
    }, [currentWorkspace]);

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg transition-all overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <h2 className="text-md font-medium text-zinc-800 dark:text-zinc-200">Recent Activity</h2>
                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">Live Updates</span>
            </div>

            <div className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                            <Clock size={20} />
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">No recent activity found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {tasks.map((task) => {
                            const config = typeIcons[task.type] || typeIcons.OTHER;
                            const TypeIcon = config.icon;
                            
                            // Safety check for date
                            const updateDate = task.updatedAt ? new Date(task.updatedAt) : new Date();

                            return (
                                <div key={task.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors cursor-default">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-md shrink-0">
                                            <TypeIcon className={`w-3.5 h-3.5 ${config.color}`} />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                                    {task.title}
                                                </h4>
                                                <span className={`shrink-0 px-2 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-tight ${statusColors[task.status] || statusColors.TODO}`}>
                                                    {task.status?.replace("_", " ")}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                                                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                                                    {task.type}
                                                </span>
                                                
                                                {task.assignee?.name && (
                                                    <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
                                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                                                            {task.assignee.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="truncate max-w-[80px]">{task.assignee.name}</span>
                                                    </div>
                                                )}

                                                <span className="ml-auto italic">
                                                    {isValid(updateDate) ? format(updateDate, "MMM d, h:mm a") : "Recently"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
