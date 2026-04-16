"use client";

import React from "react";
import { Clock, AlertCircle, Timer } from "lucide-react";

interface TaskDeadline {
    id: string;
    title: string;
    dueDate: string;
    progressPercentage: number;
    division: string;
    assigneeName: string;
    status: string;
}

interface Props {
    deadlines: TaskDeadline[];
}

function daysUntil(dateStr: string): number {
    const now = new Date();
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyColor(days: number) {
    if (days < 0) return { bg: "bg-rose-500/10 dark:bg-rose-500/20", text: "text-rose-500", border: "border-rose-500/20" };
    if (days <= 3) return { bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/20" };
    if (days <= 7) return { bg: "bg-blue-500/10 dark:bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/20" };
    return { bg: "bg-slate-500/10 dark:bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/20" };
}

const DeadlinesReminders: React.FC<Props> = ({ deadlines }) => {
    // Sort by due date, closest first; only show non-Done tasks
    const sorted = [...deadlines]
        .filter((d) => d.status !== "Done")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 6);

    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Clock className="text-blue-500" size={20} />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Upcoming Task Deadlines
                    </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                    From Roadmap tasks
                </span>
            </div>
            <div className="space-y-3">
                {sorted.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No upcoming deadlines — all tasks are done!</p>
                ) : sorted.map((item) => {
                    const days = daysUntil(item.dueDate);
                    const colors = urgencyColor(days);
                    return (
                        <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${colors.border} ${colors.bg} transition-all hover:scale-[1.01]`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {days < 0 ? (
                                    <AlertCircle size={16} className="text-rose-500 shrink-0" />
                                ) : (
                                    <Timer size={16} className={`${colors.text} shrink-0`} />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                            {item.division}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {item.assigneeName} · {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text} whitespace-nowrap`}>
                                    {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d left`}
                                </span>
                                <span className="text-[10px] text-slate-400">{item.progressPercentage}% done</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeadlinesReminders;
