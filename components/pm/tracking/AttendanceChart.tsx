"use client";

import React from "react";
import { MEETING_ATTENDANCE } from "@/data/pm-mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AttendanceChart: React.FC = () => {
    const data = MEETING_ATTENDANCE.map((m) => ({
        name: m.meeting.replace("Weekly Standup ", "#"),
        rate: Math.round((m.attended / m.total) * 100),
        attended: m.attended,
        total: m.total,
    }));

    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Meeting Attendance</h3>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-slate-500" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-slate-500" unit="%" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "12px",
                            }}
                            formatter={(value: number | string | undefined) => [`${value ?? 0}%`, "Attendance"]}
                        />
                        <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.rate >= 90 ? "#10b981" : entry.rate >= 75 ? "#3b82f6" : "#f59e0b"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttendanceChart;
