import React from "react";
import type { PMTask } from "@/types/pm-types";
import { View } from "@/types";
import { CheckCircle2, Clock, Calendar, AlertCircle, ArrowRight } from "lucide-react";

interface Props {
    tasks: PMTask[];
    currentUserId: string;
    navigate?: (view: View) => void;
}

const MyAssignedTasks: React.FC<Props> = ({ tasks, currentUserId, navigate }) => {
    // Filter tasks assigned to current user, ignore Done ones to focus on active
    const assignedTasks = tasks.filter(t => t.assigneeId === currentUserId && t.status !== "Done")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // sort by soonest due date

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Assigned Tasks</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tasks assigned to you requiring action</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate?.(View.KANBAN)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
                {assignedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <CheckCircle2 size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
                        <p className="text-sm font-medium">All caught up!</p>
                        <p className="text-xs text-center mt-1">You have no active tasks assigned right now.</p>
                    </div>
                ) : (
                    assignedTasks.map((task) => {
                        const isOverdue = new Date(task.dueDate) < new Date();
                        
                        return (
                            <button 
                                onClick={() => navigate?.(View.KANBAN)}
                                key={task.id} 
                                className="group block text-left w-full p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors hover:border-blue-300 dark:hover:border-blue-700/50"
                            >
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {task.title}
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                                        task.status === 'On going' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30' : 
                                        task.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30' : 
                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                    }`}>
                                        {task.status}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Clock size={12} className={task.progressPercentage > 0 ? "text-blue-500" : ""} />
                                        <span>{task.progressPercentage}% done</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                        {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                                        <span>Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric'})}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyAssignedTasks;
