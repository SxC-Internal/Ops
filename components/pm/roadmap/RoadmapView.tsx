"use client";

import React, { useState } from "react";
import { usePMTasks } from "@/context/PMTasksContext";
import type { PMTask } from "@/types/pm-types";
import GanttChart from "./GanttChart";
import TaskDetail from "./TaskDetail";
import AddTaskModal from "./AddTaskModal";
import { GanttChart as GanttIcon, Plus, Eye, Shield } from "lucide-react";
import { usePMRole } from "@/hooks/usePMRole";

interface Props {
    user?: any;
}

const RoadmapView: React.FC<Props> = ({ user }) => {
    const { tasks, users, addTask, deleteTask } = usePMTasks();
    const [selectedTask, setSelectedTask] = useState<PMTask | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const pmUser = users.find((u: any) => u.email === user?.email);
    const pmRole = pmUser?.memberships?.[0]?.role || "Associate";
    const permissions = usePMRole(pmRole);

    const currentUserId = pmUser?.id || '';

    const authToEdit = permissions.canEditAll || permissions.canEditSubdivision;

    // Sort tasks by start date for waterfall display
    const sortedTasks = [...tasks].sort((a, b) => {
        const aStart = a.startDate || a.dueDate;
        const bStart = b.startDate || b.dueDate;
        return new Date(aStart).getTime() - new Date(bStart).getTime();
    });

    const handleAddTask = async (newTask: PMTask) => {
        await addTask(newTask);
        setShowAddModal(false);
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTask(taskId);
        if (selectedTask?.id === taskId) {
            setSelectedTask(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <GanttIcon size={20} className="text-blue-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Roadmap
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Plan and track all project tasks across divisions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Role context badge */}
                    {authToEdit ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Shield size={13} className="text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {pmRole} — Full Access
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20">
                            <Eye size={13} className="text-slate-400" />
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                View Only — Contact a Manager to request changes
                            </span>
                        </div>
                    )}

                    {/* Add task button */}
                    {permissions.canAddTask && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm shadow-blue-500/25"
                        >
                            <Plus size={16} />
                            Add Task
                        </button>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                {[
                    { label: "To Do", color: "bg-slate-400" },
                    { label: "On Going", color: "bg-blue-500" },
                    { label: "Done", color: "bg-emerald-500" },
                    { label: "Pending", color: "bg-amber-500" },
                    { label: "Dependency", color: "border-amber-500 border-2 border-dashed bg-transparent" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                    </div>
                ))}
                <span className="text-xs text-slate-400 ml-auto">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                </span>
            </div>

            {/* Gantt Chart */}
            <GanttChart
                tasks={sortedTasks}
                onTaskClick={setSelectedTask}
                canDelete={permissions.canDeleteTask}
                onDeleteTask={handleDeleteTask}
            />

            {/* Task Detail Slide-out */}
            {selectedTask && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setSelectedTask(null)} />
                    <TaskDetail
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        pmRole={pmRole}
                        currentUserId={currentUserId}
                        onDeleteTask={handleDeleteTask}
                    />
                </>
            )}

            {/* Add Task Modal */}
            {showAddModal && (
                <AddTaskModal
                    existingTasks={tasks}
                    onSave={handleAddTask}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
};

export default RoadmapView;
