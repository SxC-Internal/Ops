"use client";

import React from "react";
import type { PMTask } from "@/types/pm-types";
import { usePMTasks } from "@/context/PMTasksContext";
import { Trash2 } from "lucide-react";

interface Props {
    task: PMTask;
    timelineStart: Date;
    dayWidth: number;
    onClick?: () => void;
    canDelete?: boolean;
    onDelete?: (taskId: string) => void;
    index?: number;
}

const statusColors: Record<string, string> = {
    "To do": "bg-slate-400",
    "On going": "bg-blue-500",
    "Done": "bg-emerald-500",
    "Pending": "bg-amber-500",
    "Not yet": "bg-slate-300 dark:bg-slate-600",
};

const GanttRow: React.FC<Props> = ({ task, timelineStart, dayWidth, onClick, canDelete, onDelete, index = 0 }) => {
    const { users } = usePMTasks();
    const assignee = users.find((u: any) => u.id === task.assigneeId);
    const start = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
    const end = new Date(task.dueDate);
    const offsetDays = Math.max(0, Math.floor((start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)));
    const durationDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) {
            onDelete?.(task.id);
        }
    };

    // Staggered fade-in delay per row
    const animationDelay = `${index * 60}ms`;

    return (
        <div
            className="flex items-center h-12 group cursor-pointer animate-gantt-row"
            style={{ animationDelay, opacity: 0, animationFillMode: "forwards" }}
            onClick={onClick}
        >
            {/* Sticky label */}
            <div
                className="w-56 shrink-0 pr-4 flex items-center gap-1.5 pl-1 sticky left-0 z-10 bg-white dark:bg-slate-800/60 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/40 transition-colors"
                style={{ boxShadow: '4px 0 12px -2px rgba(0,0,0,0.08)' }}
            >
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        title="Delete task (Managers & Chiefs only)"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 shrink-0"
                    >
                        <Trash2 size={13} />
                    </button>
                )}
                {assignee?.avatar && (
                    <img src={assignee.avatar} alt="" className="w-5 h-5 rounded-full shrink-0" />
                )}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-blue-500 transition-colors">
                    {task.title}
                </span>
            </div>

            {/* Bar area */}
            <div className="flex-1 relative h-full flex items-center">
                <div
                    className={`absolute h-7 rounded-md ${statusColors[task.status] || "bg-blue-500"} opacity-80 group-hover:opacity-100 transition-all shadow-sm flex items-center px-2 animate-bar-grow`}
                    style={{
                        left: `${offsetDays * dayWidth}px`,
                        width: `${Math.max(durationDays * dayWidth, 30)}px`,
                        animationDelay,
                        animationFillMode: "backwards",
                        transformOrigin: "left center",
                    }}
                >
                    {/* Progress fill */}
                    <div
                        className="absolute inset-0 rounded-md bg-white/20"
                        style={{ width: `${task.progressPercentage}%` }}
                    />
                    <span className="relative z-10 text-[10px] font-bold text-white whitespace-nowrap">
                        {task.progressPercentage}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GanttRow;
