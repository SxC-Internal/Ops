"use client";

import React from "react";
import type { MemberPerformanceData } from "@/types/pm-types";

interface Props {
    members: MemberPerformanceData[];
}

const MemberPerformance: React.FC<Props> = ({ members }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Associate Motivation Scores</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((m) => (
                    <div key={m.userId} className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        {/* Radial */}
                        <div className="relative w-16 h-16 mb-3">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-slate-200 dark:stroke-slate-600" />
                                <circle
                                    cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                                    className={m.motivationScore >= 90 ? "stroke-emerald-500" : m.motivationScore >= 60 ? "stroke-blue-500" : m.motivationScore >= 40 ? "stroke-amber-500" : "stroke-rose-500"}
                                    strokeLinecap="round"
                                    strokeDasharray={`${(m.motivationScore / 100) * 163.4} 163.4`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
                                {m.motivationScore}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white text-center">{m.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Motivation</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500 text-center">
                Scores calculated automatically from the latest Associate Weekly Form submissions.
            </div>
        </div>
    );
};

export default MemberPerformance;
