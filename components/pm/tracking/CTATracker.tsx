"use client";

import React from "react";
import { Plane, Users, CheckCircle, Clock } from "lucide-react";

const CTATracker: React.FC = () => {
    const goals = [
        { id: 1, name: "Visa Process for Int. Speakers", progress: 85, icon: Plane, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { id: 2, name: "Speaker Handlers Allocation", progress: 100, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { id: 3, name: "Speaker Briefing Sessions", progress: 40, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm h-full">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Users size={18} />
                </div>
                CTA Division Progress Tracker
            </h3>

            <div className="space-y-6">
                {goals.map((goal) => (
                    <div key={goal.id}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${goal.bg} ${goal.color}`}>
                                    {goal.progress === 100 ? <CheckCircle size={14} /> : <goal.icon size={14} />}
                                </div>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{goal.name}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{goal.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CTATracker;
