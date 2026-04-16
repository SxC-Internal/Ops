"use client";

import React from "react";
import type { PMTask } from "@/types/pm-types";
import { usePMTasks } from "@/context/PMTasksContext";
import { Calendar, User as UserIcon, CheckCircle } from "lucide-react";
import TaskDetailsModal from "./TaskDetailsModal";

interface Props {
    task: PMTask;
    onClick?: () => void;
    user?: any;
}

const priorityByDays = (dueDate: string) => {
    const days = Math.ceil(
        (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return { label: "Overdue", color: "bg-rose-500/10 text-rose-500 border-rose-500/30" };
    if (days <= 3) return { label: "Urgent", color: "bg-amber-500/10 text-amber-500 border-amber-500/30" };
    return { label: "", color: "" };
};

const KanbanCard: React.FC<Props> = ({ task, onClick, user }) => {
    const { users, updateTask } = usePMTasks();
    const assignee = users.find((u: any) => u.id === task.assigneeId);
    const priority = priorityByDays(task.dueDate);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Resolve the current user's role
    const pmUser = users.find((u: any) => u.email === user?.email);
    const pmRole = pmUser?.memberships?.[0]?.role || "member";
    const canApprove = (pmRole === "head" || pmRole === "manager") && task.status === "Pending";

    const handleCardClick = () => {
        setIsModalOpen(true);
        if (onClick) onClick();
    };

    const handleApprove = (e: React.MouseEvent) => {
        e.stopPropagation(); // don't open the detail modal
        updateTask(task.id, { status: "Done", progressPercentage: 100 });
    };

    return (
        <>
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("taskId", task.id);
                    e.currentTarget.style.opacity = "0.5";
                }}
                onDragEnd={(e) => {
                    e.currentTarget.style.opacity = "1";
                }}
                onClick={handleCardClick}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/40 transition-all cursor-grab active:cursor-grabbing group"
            >
                {/* Division badge */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {task.division}
                    </span>
                    {priority.label && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priority.color}`}>
                            {priority.label}
                        </span>
                    )}
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
                    {task.title}
                </p>

                {/* Progress bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400">Progress</span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{task.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${task.progressPercentage === 100
                                ? "bg-emerald-500"
                                : task.progressPercentage >= 50
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                                }`}
                            style={{ width: `${task.progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Footer: assignee + due date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        {assignee?.avatar ? (
                            <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full" />
                        ) : (
                            <UserIcon size={14} className="text-slate-400" />
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                            {assignee?.name || "Unassigned"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={12} />
                        <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                </div>

                {/* Approve button — managers/chiefs only, only on Pending tasks */}
                {canApprove && (
                    <button
                        onClick={handleApprove}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold py-1.5 rounded-lg transition-all shadow-sm shadow-emerald-500/20"
                    >
                        <CheckCircle size={13} />
                        Approve & Mark Done
                    </button>
                )}
            </div>

            {isModalOpen && (
                <TaskDetailsModal
                    task={task}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentUserRole={pmRole}
                    currentUserDivision={pmUser?.currentDivision || "Operations"}
                    currentUserId={pmUser?.id || ''}
                />
            )}
        </>
    );
};

export default KanbanCard;
