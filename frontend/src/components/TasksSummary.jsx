import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react"; // Clerk se asli user mangwane ke liye

export default function TasksSummary() {
    // Redux se workspace data nikalna
    const { currentWorkspace } = useSelector((state) => state.workspace);
    
    // Clerk se login user ki details lena
    const { user: clerkUser } = useUser();
    
    const [tasks, setTasks] = useState([]);

    // Get all tasks for all projects in current workspace
    useEffect(() => {
        if (currentWorkspace?.projects) {
            // Saare projects ke tasks ko ek hi array mein merge karna safely
            const allTasks = currentWorkspace.projects.flatMap((project) => project.tasks || []);
            setTasks(allTasks);
        } else {
            setTasks([]);
        }
    }, [currentWorkspace]);

    // --- Filters with Safety Guards ---
    
    // 1. "My Tasks": Jo tasks login user ko assigned hain
    const myTasks = tasks.filter(t => t?.assigneeId === clerkUser?.id);
    
    // 2. "Overdue": Jo tasks complete nahi hue aur date nikal chuki hai
    const overdueTasks = tasks.filter(t => 
        t?.due_date && 
        new Date(t.due_date) < new Date() && 
        t.status !== 'COMPLETED' // Yahan apne status se match karein (e.g., 'DONE' or 'COMPLETED')
    );

    // 3. "In Progress": Jo abhi chal rahe hain
    const inProgressIssues = tasks.filter(t => t?.status === 'IN_PROGRESS');

    const summaryCards = [
        {
            title: "My Tasks",
            count: myTasks.length,
            icon: User,
            color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
            items: myTasks.slice(0, 3) // Sirf top 3 dikhane ke liye
        },
        {
            title: "Overdue",
            count: overdueTasks.length,
            icon: AlertTriangle,
            color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
            items: overdueTasks.slice(0, 3)
        },
        {
            title: "In Progress",
            count: inProgressIssues.length,
            icon: Clock,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
            items: inProgressIssues.slice(0, 3)
        }
    ];

    return (
        <div className="space-y-6">
            {summaryCards.map((card) => (
                <div key={card.title} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 rounded-lg overflow-hidden">
                    {/* Card Header */}
                    <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                <card.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{card.title}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${card.color}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Content (Task List) */}
                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">
                                No {card.title.toLowerCase()} found
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {card.items.map((task) => (
                                    <div key={task.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                                        <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {task.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-600 dark:text-zinc-500 uppercase tracking-tight mt-1">
                                            {task.priority} Priority • {task.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                ))}
                                
                                {card.count > 3 && (
                                    <button className="flex items-center justify-center w-full text-xs text-blue-500 dark:text-blue-400 hover:underline mt-2">
                                        View {card.count - 3} more <ArrowRight className="w-3 h-3 ml-2" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
