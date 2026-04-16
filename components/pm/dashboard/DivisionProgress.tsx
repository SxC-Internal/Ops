"use client";

import React from "react";

interface DivisionStat {
    division: string;
    avgProgress: number;
    taskCount: number;
    completedCount: number;
}

interface Props {
    divisions: DivisionStat[];
}

const divisionColors: Record<string, string> = {
    ops: "from-blue-500 to-blue-600",
    Operations: "from-blue-500 to-blue-600",
    Marketing: "from-amber-500 to-amber-600",
    Events: "from-emerald-500 to-emerald-600",
    Executive: "from-violet-500 to-violet-600",
};

const DivisionProgress: React.FC<Props> = ({ divisions }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Division Progress
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                    Computed from tasks
                </span>
            </div>
            <div className="space-y-4">
                {divisions.map((d) => (
                    <div key={d.division}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {d.division}
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                    {d.completedCount}/{d.taskCount} tasks done
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {d.avgProgress}%
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${divisionColors[d.division] || "from-blue-500 to-blue-600"} transition-all duration-700 ease-out`}
                                style={{ width: `${d.avgProgress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DivisionProgress;
