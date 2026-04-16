"use client";

import React from "react";
import type { BatchEvaluationData } from "@/types/pm-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
    evaluations: BatchEvaluationData[];
}

const BatchEvaluation: React.FC<Props> = ({ evaluations }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Batch Evaluations</h3>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evaluations}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="batchName" tick={{ fontSize: 11 }} className="fill-slate-500" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-slate-500" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="taskCompletion" name="Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="attendance" name="Attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="motivation" name="Motivation" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BatchEvaluation;
