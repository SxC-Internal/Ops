"use client";

import React from "react";
import { Users, BookOpen, ArrowRight, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 1. Import the global Program type!
import type { Program } from "@/types";

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  const isActive = program.status === "Active";

  return (
    <Card 
      onClick={onClick}
      className="group bg-[#071838]/60 backdrop-blur-md border-white/10 hover:border-blue-500/50 transition-all shadow-lg hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge 
            className={
              isActive 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30" 
            }
          >
            {program.status}
          </Badge>
          <div className="flex items-center text-slate-400 text-sm gap-1.5 font-medium">
            <Layers className="w-4 h-4" />
            <span>{program.batch}</span>
          </div>
        </div>

        {/* Use program.title instead of name */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {program.title}
        </h3>
        
        <p className="text-sm text-slate-400 mb-6 line-clamp-2">
          {program.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Users className="w-4 h-4 text-purple-400" />
              {/* Use program.participants instead of attendees */}
              <span>{program.participants} Participants</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>{program.mentors} Mentors</span>
            </div>
          </div>
          
          <button className="text-blue-400 group-hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors">
            Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;