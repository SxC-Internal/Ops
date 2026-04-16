"use client";

import React, { useState } from "react";
import type { User } from "@/types";
import { Folder } from "lucide-react";
import { OPS_BATCHES } from "./opsData";
import BatchContent from "./BatchContent";

interface OperationsWorkspaceProps {
  user: User;
}

const OperationsWorkspace: React.FC<OperationsWorkspaceProps> = ({ user }) => {
  // Default to the first batch in our data (Batch 13)
  const [selectedBatchId, setSelectedBatchId] = useState<string>(OPS_BATCHES[0].id);

  // Find the full batch object based on the selected ID
  const selectedBatch = OPS_BATCHES.find(b => b.id === selectedBatchId) || OPS_BATCHES[0];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] gap-6 animate-fade-in">
      
      {/* LEFT PANE: Directory Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Operations</h2>
          <p className="text-sm text-slate-500">Knowledge Base & Drive</p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {OPS_BATCHES.map((batch) => {
            const isActive = selectedBatchId === batch.id;
            return (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchId(batch.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Folder className={`w-5 h-5 ${isActive ? "text-blue-200 fill-blue-400/20" : "text-slate-400"}`} />
                <div className="flex-1 truncate">
                  <p className="font-semibold text-sm">{batch.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANE: Batch Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <BatchContent batch={selectedBatch} />
      </div>

    </div>
  );
};

export default OperationsWorkspace;