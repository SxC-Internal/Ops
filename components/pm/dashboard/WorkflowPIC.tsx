"use client";

import React from "react";
import { Mail, ArrowRight } from "lucide-react";
import type { DivisionWorkflow } from "@/types/pm-types";

interface Props {
    workflows: DivisionWorkflow[];
}

const divBorder: Record<string, string> = {
    Operations: "border-l-blue-500",
    Marketing: "border-l-amber-500",
    Events: "border-l-emerald-500",
    Executive: "border-l-violet-500",
};

const WorkflowPIC: React.FC<Props> = ({ workflows }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
                Division Workflows & PIC
            </h3>
            <div className="space-y-3">
                {workflows.map((w) => (
                    <div
                        key={w.division}
                        className={`border-l-4 ${divBorder[w.division] || "border-l-slate-500"} bg-slate-50 dark:bg-slate-700/30 rounded-r-lg p-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {w.division}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail size={12} className="text-slate-400" />
                                    <a
                                        href={`mailto:${w.picEmail}`}
                                        className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                                    >
                                        {w.picName} — {w.picEmail}
                                    </a>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">
                                PIC
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {w.tasks.map((task, i) => (
                                <React.Fragment key={task}>
                                    <span className="text-xs px-2 py-0.5 bg-white dark:bg-slate-600 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-500">
                                        {task}
                                    </span>
                                    {i < w.tasks.length - 1 && (
                                        <ArrowRight size={12} className="text-slate-300 dark:text-slate-500 self-center" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkflowPIC;
