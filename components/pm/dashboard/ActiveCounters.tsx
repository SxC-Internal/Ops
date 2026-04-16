"use client";

import React from "react";
import { ListChecks, CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

const ActiveCounters: React.FC<Props> = ({ totalTasks, completedTasks, overdueTasks }) => {
    const items = [
        {
            label: "Total Tasks",
            value: totalTasks,
            icon: ListChecks,
            color: "text-blue-500",
            bg: "bg-blue-500/10 dark:bg-blue-500/15",
            subtitle: "Across all divisions",
        },
        {
            label: "Completed",
            value: completedTasks,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
            subtitle: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% of total` : "No tasks yet",
        },
        {
            label: "Overdue",
            value: overdueTasks,
            icon: AlertTriangle,
            color: overdueTasks > 0 ? "text-rose-500" : "text-emerald-500",
            bg: overdueTasks > 0 ? "bg-rose-500/10 dark:bg-rose-500/15" : "bg-emerald-500/10 dark:bg-emerald-500/15",
            subtitle: overdueTasks > 0 ? "Need attention" : "All on track!",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {items.map((c) => (
                <div
                    key={c.label}
                    className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
                >
                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                        <c.icon size={22} className={c.color} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</p>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{c.label}</p>
                        <p className="text-[10px] text-slate-400">{c.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveCounters;
