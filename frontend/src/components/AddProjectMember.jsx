import { useState } from "react";
import { Mail, UserPlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";
import toast from "react-hot-toast";
import { fetchWorkspaces } from "../features/workspaceSlice";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);

    // Safety check for project finding
    const project = currentWorkspace?.projects?.find((p) => p.id === id);
    const projectMembersEmails = project?.members?.map((member) => member.user?.email) || [];

    const [email, setEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please select a member");
        
        setIsAdding(true);
        const toastId = toast.loading("Adding member...");
        
        try {
            const token = await getToken();
            await api.post(`/api/projects/${project.id}/addmember`, { email }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Member added to project!", { id: toastId });
            setEmail(''); // Input reset karna zaroori hai
            setIsDialogOpen(false);
            
            // Re-fetch data to update UI globally
            dispatch(fetchWorkspaces(token));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add member.", { id: toastId });
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <UserPlus className="size-5 text-blue-500" /> Add Team Member
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                            Select a member from <span className="font-medium text-zinc-700 dark:text-zinc-300">{currentWorkspace?.name}</span>
                        </p>
                    </div>
                    <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition text-zinc-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Workspace Members
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <select 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="pl-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-200 text-sm py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none" 
                                required 
                            >
                                <option value="">Choose a person...</option>
                                {currentWorkspace?.members
                                    ?.filter((member) => !projectMembersEmails.includes(member.user?.email))
                                    .map((member) => (
                                        <option key={member.user?.id} value={member.user?.email}>
                                            {member.user?.email}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        {currentWorkspace?.members?.filter(m => !projectMembersEmails.includes(m.user?.email)).length === 0 && (
                            <p className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                                Sabhi workspace members pehle se hi is project mein hain.
                            </p>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => setIsDialogOpen(false)} 
                            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isAdding || !email} 
                            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all"
                        >
                            {isAdding ? "Adding..." : "Add to Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;
