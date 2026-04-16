"use client";

import React, { useState } from "react";
import { usePMTasks } from "@/context/PMTasksContext";
import KanbanColumn from "./KanbanColumn";
import AddTaskModal from "./AddTaskModal";
import { KanbanSquare, Plus } from "lucide-react";
import { usePMRole } from "@/hooks/usePMRole";

const COLUMNS = [
    { status: "To do" as const, color: "text-slate-600 dark:text-slate-300", dotColor: "bg-slate-400" },
    { status: "On going" as const, color: "text-blue-600 dark:text-blue-400", dotColor: "bg-blue-500" },
    { status: "Pending" as const, color: "text-amber-600 dark:text-amber-400", dotColor: "bg-amber-500" },
    { status: "Done" as const, color: "text-emerald-600 dark:text-emerald-400", dotColor: "bg-emerald-500" },
];
interface Props {
    user?: any;
}

const KanbanView: React.FC<Props> = ({ user }) => {
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const { tasks, updateTask } = usePMTasks();

    const handleDropTask = (taskId: string, newStatus: any) => {
        updateTask(taskId, { status: newStatus });
    };
    
    // Role mapping
    const pmRole = user?.membershipRole === 'head' ? 'Chief' : user?.membershipRole === 'manager' ? 'Manager' : 'Associate';
    const permissions = usePMRole(pmRole);
    const isAdmin = user?.role === 'admin';
    const canManage = isAdmin || permissions.canAddTask;

    const tasksByStatus = (status: string) =>
        tasks.filter((t) => t.status === status);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <KanbanSquare size={20} className="text-blue-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Tasks
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage tasks across your project lifecycle
                    </p>
                </div>
                {canManage && (
                    <button
                        onClick={() => setAssignModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={16} />
                        Add Task
                    </button>
                )}
            </div>

            {/* Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.status}
                        title={col.status}
                        tasks={tasksByStatus(col.status)}
                        color={col.color}
                        dotColor={col.dotColor}
                        user={user}
                        onDropTask={handleDropTask}
                    />
                ))}
            </div>


            <AddTaskModal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                user={user}
            />
        </div>
    );
};

export default KanbanView;
