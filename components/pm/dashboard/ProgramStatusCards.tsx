"use client";

import React from "react";

interface Props {
    statuses: { label: string; count: number; color: string; bgColor: string }[];
}

const ProgramStatusCards: React.FC<Props> = ({ statuses }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((s) => (
                <div
                    key={s.label}
                    className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/50 ${s.bgColor} p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                    {/* Decorative circle */}
                    <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${s.color} opacity-10`} />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        {s.label}
                    </p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                </div>
            ))}
        </div>
    );
};

export default ProgramStatusCards;
