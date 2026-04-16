"use client";

import React, { useState, useMemo } from "react";
import { Search, FolderGit2 } from "lucide-react";
import ProgramCard from "./ProgramCard";
import ProgramDetailView from "./ProgramDetailView";

// Make sure we bring in the User information
import type { Program, User } from "@/types";
import { PROGRAMS } from "@/constants";

// We need to tell this page to expect the user information
interface ProgramsViewProps {
  user: User;
}

const ProgramsView: React.FC<ProgramsViewProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Group our events by their batch
  const groupedBatches = useMemo(() => {
    const filtered = PROGRAMS.filter(program => 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.batch.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = filtered.reduce((acc, program) => {
      const batchName = program.batch;
      if (!acc[batchName]) {
        acc[batchName] = [];
      }
      acc[batchName].push(program);
      return acc;
    }, {} as Record<string, Program[]>);

    return Object.entries(grouped)
      .map(([batchName, programs]) => ({ batchName, programs }))
      .sort((a, b) => b.batchName.localeCompare(a.batchName));
      
  }, [searchQuery]);

  // If a card is clicked, show the details and pass the user along!
  if (selectedProgram) {
    return (
      <ProgramDetailView 
        program={selectedProgram} 
        user={user} 
        onBack={() => setSelectedProgram(null)} 
      />
    );
  }

  return (
    <div className="space-y-10 animate-fade-in p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#071838]/40 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <FolderGit2 className="text-blue-500 w-8 h-8" />
            Projects & Events
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Browse upcoming initiatives and explore the historical archive of past batches.
          </p>
        </div>
        
        <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 w-full md:w-80 border border-white/10 focus-within:border-blue-500/50 transition-all shadow-inner">
          <Search size={18} className="text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search events, batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
        </div>
      </div>

      {/* The List of Batches */}
      <div className="space-y-12">
        {groupedBatches.length > 0 ? (
          groupedBatches.map((batch) => (
            <div key={batch.batchName} className="relative">
              
              {/* Batch Section Header */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {batch.batchName}
                </h3>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Grid of Program Cards for this Batch */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {batch.programs.map((program) => (
                  <ProgramCard 
                    key={program.id} 
                    program={program} 
                    onClick={() => setSelectedProgram(program)} 
                  />
                ))}
              </div>
              
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/10">
            <p className="text-slate-400 text-lg">No events found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProgramsView;