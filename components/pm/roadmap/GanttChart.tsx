"use client";

import React, { useMemo, useState } from "react";
import type { PMTask } from "@/types/pm-types";
import GanttRow from "./GanttRow";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
    tasks: PMTask[];
    onTaskClick?: (task: PMTask) => void;
    canDelete?: boolean;
    onDeleteTask?: (taskId: string) => void;
}

const MIN_DAY_WIDTH = 20;
const MAX_DAY_WIDTH = 80;
const DEFAULT_DAY_WIDTH = 40;
const ZOOM_STEP = 10;

const GanttChart: React.FC<Props> = ({ tasks, onTaskClick, canDelete, onDeleteTask }) => {
    const [dayWidth, setDayWidth] = useState(DEFAULT_DAY_WIDTH);

    const zoomIn = () => setDayWidth((w) => Math.min(w + ZOOM_STEP, MAX_DAY_WIDTH));
    const zoomOut = () => setDayWidth((w) => Math.max(w - ZOOM_STEP, MIN_DAY_WIDTH));

    const { timelineStart, totalDays, dateHeaders } = useMemo(() => {
        const allDates = tasks.flatMap((t) => [
            t.startDate ? new Date(t.startDate) : new Date(t.dueDate),
            new Date(t.dueDate),
        ]);
        const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

        minDate.setDate(minDate.getDate() - 2);
        maxDate.setDate(maxDate.getDate() + 5);

        const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

        const headers: { label: string; day: number }[] = [];
        for (let i = 0; i <= totalDays; i += 1) {
            const d = new Date(minDate);
            d.setDate(d.getDate() + i);
            headers.push({
                label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                day: i,
            });
        }

        return { timelineStart: minDate, totalDays, dateHeaders: headers };
    }, [tasks]);

    // Build dependency lines
    const depLines = useMemo(() => {
        const lines: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
        tasks.forEach((task, i) => {
            task.dependencies.forEach((depId) => {
                const depIndex = tasks.findIndex((t) => t.id === depId);
                if (depIndex === -1) return;
                const depTask = tasks[depIndex];
                const depEnd = new Date(depTask.dueDate);
                const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);

                const fromDay = Math.floor((depEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
                const toDay = Math.floor((taskStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));

                lines.push({
                    fromX: fromDay * dayWidth + 224,
                    fromY: depIndex * 48 + 24,
                    toX: toDay * dayWidth + 224,
                    toY: i * 48 + 24,
                });
            });
        });
        return lines;
    }, [tasks, timelineStart, dayWidth]);

    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">

            {/* Zoom Controls */}
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Zoom</span>
                <button
                    onClick={zoomOut}
                    disabled={dayWidth <= MIN_DAY_WIDTH}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Zoom out"
                >
                    <ZoomOut size={15} />
                </button>

                {/* Zoom level pip track */}
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: (MAX_DAY_WIDTH - MIN_DAY_WIDTH) / ZOOM_STEP + 1 }).map((_, i) => {
                        const val = MIN_DAY_WIDTH + i * ZOOM_STEP;
                        return (
                            <button
                                key={val}
                                onClick={() => setDayWidth(val)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    dayWidth === val
                                        ? "bg-blue-500 scale-125"
                                        : "bg-slate-300 dark:bg-slate-600 hover:bg-blue-300"
                                }`}
                                title={`${val}px/day`}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={zoomIn}
                    disabled={dayWidth >= MAX_DAY_WIDTH}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Zoom in"
                >
                    <ZoomIn size={15} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <div style={{ minWidth: `${224 + totalDays * dayWidth}px` }}>
                    {/* Date Header */}
                    <div className="flex items-center h-10 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                        <div className="w-56 shrink-0 px-4 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800" style={{ boxShadow: '4px 0 12px -2px rgba(0,0,0,0.08)' }}>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Task</span>
                        </div>
                        <div className="flex-1 flex relative">
                            {dateHeaders.filter((_, i) => i % 3 === 0).map((h) => (
                                <div
                                    key={h.day}
                                    className="text-[10px] text-slate-400 font-medium transition-all duration-300"
                                    style={{ position: "absolute", left: `${h.day * dayWidth}px` }}
                                >
                                    {h.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="relative">
                        {/* Grid lines */}
                        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: `${tasks.length * 48}px` }}>
                            {dateHeaders.filter((_, i) => i % 7 === 0).map((h) => (
                                <line
                                    key={h.day}
                                    x1={224 + h.day * dayWidth}
                                    y1={0}
                                    x2={224 + h.day * dayWidth}
                                    y2={tasks.length * 48}
                                    className="stroke-slate-200 dark:stroke-slate-700"
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                />
                            ))}
                            {/* Dependency arrows */}
                            {depLines.map((line, idx) => (
                                <g key={idx}>
                                    <path
                                        d={`M ${line.fromX} ${line.fromY} C ${line.fromX + 40} ${line.fromY}, ${line.toX - 40} ${line.toY}, ${line.toX} ${line.toY}`}
                                        fill="none"
                                        className="stroke-amber-500"
                                        strokeWidth={2}
                                        strokeDasharray="6 3"
                                        markerEnd="url(#arrowhead)"
                                    />
                                </g>
                            ))}
                            <defs>
                                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" className="fill-amber-500" />
                                </marker>
                            </defs>
                        </svg>

                        {/* Task rows */}
                        {tasks.map((task, index) => (
                            <GanttRow
                                key={task.id}
                                task={task}
                                timelineStart={timelineStart}
                                dayWidth={dayWidth}
                                onClick={() => onTaskClick?.(task)}
                                canDelete={canDelete}
                                onDelete={onDeleteTask}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
