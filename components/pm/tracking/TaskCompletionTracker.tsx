"use client";

import React from "react";
import { PM_TASKS } from "@/data/pm-mock-data";

const TaskCompletionTracker: React.FC = () => {
    const total = PM_TASKS.length;
    const done = PM_TASKS.filter((t) => t.status === "Done").length;
    const ongoing = PM_TASKS.filter((t) => t.status === "On going").length;
    const todo = PM_TASKS.filter((t) => t.status === "To do").length;
    const other = total - done - ongoing - todo;

    const completionRate = Math.round((done / total) * 100);

    const segments = [
        { label: "Done", count: done, pct: Math.round((done / total) * 100), color: "bg-emerald-500" },
        { label: "On Going", count: ongoing, pct: Math.round((ongoing / total) * 100), color: "bg-blue-500" },
        { label: "To Do", count: todo, pct: Math.round((todo / total) * 100), color: "bg-slate-400" },
        { label: "Other", count: other, pct: Math.round((other / total) * 100), color: "bg-amber-500" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Task Completion</h3>

            <div className="flex items-center gap-6 mb-4">
                <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-700" />
                        <circle cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-emerald-500"
                            strokeLinecap="round" strokeDasharray={`${(completionRate / 100) * 213.6} 213.6`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
                        {completionRate}%
                    </span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{done}/{total}</p>
                    <p className="text-xs text-slate-500">Tasks completed</p>
                </div>
            </div>

            {/* Stacked bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex mb-3">
                {segments.map((s) => (
                    s.pct > 0 && <div key={s.label} className={`${s.color} h-full`} style={{ width: `${s.pct}%` }} />
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                {segments.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-xs text-slate-500">{s.label} ({s.count})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskCompletionTracker;
