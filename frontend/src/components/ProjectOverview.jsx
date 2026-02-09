import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format, isValid } from "date-fns"; // isValid add kiya crash rokne ke liye
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const ProjectOverview = () => {
    const statusColors = {
        PLANNING: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
        ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
        ON_HOLD: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
        COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
    };

    const priorityColors = {
        LOW: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400",
        MEDIUM: "border-amber-400 text-amber-700 dark:border-amber-500 dark:text-amber-400",
        HIGH: "border-red-400 text-red-700 dark:border-red-500 dark:text-red-400", // High ko red kiya hai better visibility ke liye
    };

    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (currentWorkspace?.projects) {
            // Sort projects: Latest update upar dikhe (optional)
            setProjects(currentWorkspace.projects);
        }
    }, [currentWorkspace]);

    // Safety: Agar workspace load nahi hua toh blank na dikhao
    if (!currentWorkspace) return null;

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 rounded-lg overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <h2 className="text-md font-medium text-zinc-800 dark:text-zinc-300">Project Overview</h2>
                <Link to={'/projects'} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            <div className="p-0">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 rounded-full flex items-center justify-center">
                            <FolderOpen size={32} />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium">No projects yet</p>
                        <p className="text-xs text-zinc-500 mt-1">Start by creating your first project in this workspace.</p>
                        <button onClick={() => setIsDialogOpen(true)} className="mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm">
                            Create Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {projects.slice(0, 5).map((project) => (
                            <Link key={project.id} to={`/projectsDetail?id=${project.id}&tab=tasks`} className="block p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                            {project.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 shrink-0">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[project.status] || statusColors.PLANNING}`}>
                                            {project.status?.replace('_', ' ')}
                                        </span>
                                        <div title={`Priority: ${project.priority}`} className={`w-2.5 h-2.5 rounded-full border-2 ${priorityColors[project.priority] || priorityColors.LOW}`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-500 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <UsersIcon className="w-3.5 h-3.5" />
                                            <span>{project.members?.length || 0} members</span>
                                        </div>
                                        
                                        {project.end_date && isValid(new Date(project.end_date)) && (
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{format(new Date(project.end_date), "MMM d, yyyy")}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-tighter">
                                        <span className="text-zinc-400">Progress</span>
                                        <span className="text-zinc-700 dark:text-zinc-300">{project.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500 ease-out" 
                                            style={{ width: `${project.progress || 0}%` }} 
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectOverview;
