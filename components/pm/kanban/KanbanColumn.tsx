"use client";

import React from "react";
import type { PMTask, PMTaskStatus } from "@/types/pm-types";
import KanbanCard from "./KanbanCard";

interface Props {
    title: PMTaskStatus;
    tasks: PMTask[];
    color: string;
    dotColor: string;
    user?: any;
    onDropTask?: (taskId: string, newStatus: PMTaskStatus) => void;
}

const KanbanColumn: React.FC<Props> = ({ title, tasks, color, dotColor, user, onDropTask }) => {
    return (
        <div 
            className="flex-1 min-w-[280px] transition-all rounded-xl"
            onDragOver={(e) => {
                e.preventDefault();
            }}
            onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("taskId");
                if (taskId && onDropTask) onDropTask(taskId, title);
            }}
        >
            {/* Column header */}
            <div className={`flex items-center gap-2 mb-4 px-1`}>
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">
                    {tasks.length}
                </span>
            </div>

            {/* Cards area */}
            <div className="space-y-3 min-h-[200px] bg-slate-50/50 dark:bg-slate-800/20 rounded-xl p-3 border border-dashed border-slate-200 dark:border-slate-700/50">
                {tasks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">No tasks</p>
                )}
                {tasks.map((task) => (
                    <KanbanCard key={task.id} task={task} user={user} />
                ))}
            </div>
        </div>
    );
};

export default KanbanColumn;
