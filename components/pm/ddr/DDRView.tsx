"use client";

import React from "react";
import DatabaseTab from "./DatabaseTab";
import { Database } from "lucide-react";

interface Props {
    user?: any;
}

const DDRView: React.FC<Props> = ({ user }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Database size={20} className="text-blue-500" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Database
                    </h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Centralized database for all batches
                </p>
            </div>

            {/* Content */}
            <DatabaseTab />
        </div>
    );
};

export default DDRView;
