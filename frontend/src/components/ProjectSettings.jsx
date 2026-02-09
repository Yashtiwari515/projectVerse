import { format } from "date-fns";
import { Plus, Save, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import AddProjectMember from "./AddProjectMember";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";
import { fetchWorkspaces } from "../features/workspaceSlice";
import toast from "react-hot-toast";

export default function ProjectSettings({ project }) {
    const dispatch = useDispatch();
    const { getToken } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        progress: 0,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!project?.id) return toast.error("Project ID missing!");

        setIsSubmitting(true);
        const toastId = toast.loading("Saving changes...");
        try {
            const token = await getToken();
            const { data } = await api.put(`/api/projects/${project.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Re-fetch workspaces to sync global state
            dispatch(fetchWorkspaces(token));
            toast.success(data.message || "Project updated successfully.", { id: toastId });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save changes.", { id: toastId });
            console.error("Update Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                status: project.status || "PLANNING",
                priority: project.priority || "MEDIUM",
                progress: project.progress || 0,
                // input type="date" expects yyyy-MM-dd, so we store the Date object
                start_date: project.start_date ? new Date(project.start_date) : new Date(),
                end_date: project.end_date ? new Date(project.end_date) : new Date(),
            });
        }
    }, [project]);

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
    const cardClasses = "rounded-xl border p-6 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 shadow-sm";
    const labelClasses = "text-sm font-medium text-zinc-600 dark:text-zinc-400";

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Project Details Form */}
            <div className={cardClasses}>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <Save className="w-5 h-5 text-blue-500" /> Project Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Project Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} placeholder="Enter project name" required />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " h-28 resize-none"} placeholder="What is this project about?" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelClasses}>Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClasses} >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Priority</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={inputClasses} >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelClasses}>Start Date</label>
                            <input type="date" value={formData.start_date ? format(new Date(formData.start_date), "yyyy-MM-dd") : ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputClasses} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>End Date</label>
                            <input type="date" value={formData.end_date ? format(new Date(formData.end_date), "yyyy-MM-dd") : ""} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className={inputClasses} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={labelClasses}>Progress: {formData.progress}%</label>
                        <input type="range" min="0" max="100" step="5" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} className="w-full accent-blue-500 dark:accent-blue-400" />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-md disabled:opacity-50" >
                        {isSubmitting ? "Syncing..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Team Members Section */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Team Members</h2>
                            <p className="text-xs text-zinc-500">People working on this project</p>
                        </div>
                        <button type="button" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md border border-zinc-200 dark:border-zinc-700 transition" >
                            <Plus className="size-3.5" /> Add Member
                        </button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} projectId={project?.id} />
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {project?.members?.length > 0 ? (
                            project.members.map((member) => (
                                <div key={member.id} className="group flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all" >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center shrink-0">
                                            <Mail className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">
                                                {member?.user?.email || "Unknown User"}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Member</span>
                                        </div>
                                    </div>

                                    {project.team_lead === member.userId && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase">Lead</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-zinc-500 italic">No members found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
