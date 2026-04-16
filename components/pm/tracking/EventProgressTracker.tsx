"use client";

import React from "react";
import type { TrackingEvent } from "@/types/pm-types";

interface Props {
    events: TrackingEvent[];
}

const statusColor: Record<string, string> = {
    "On Going": "bg-blue-500",
    Planning: "bg-amber-500",
    Preparation: "bg-violet-500",
    Completed: "bg-emerald-500",
};

const EventProgressTracker: React.FC<Props> = ({ events }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Event Progress</h3>
            <div className="space-y-4">
                {events.map((evt) => (
                    <div key={evt.id}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{evt.name}</span>
                                <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${statusColor[evt.status] || "bg-slate-500"}`}>
                                    {evt.status}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{evt.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${statusColor[evt.status] || "bg-blue-500"} transition-all duration-700`}
                                style={{ width: `${evt.progressPercentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventProgressTracker;
