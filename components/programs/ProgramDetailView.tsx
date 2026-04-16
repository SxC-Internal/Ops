import React from "react";
import { ArrowLeft, Calendar, MapPin, Users, BookOpen, Clock, Edit } from "lucide-react";
import type { Program, User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProgramDetailViewProps {
  program: Program;
  user: User;
  onBack: () => void;
}

const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({ program, user, onBack }) => {
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-8 max-w-5xl mx-auto pb-20">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Programs
      </button>

      {/* Main Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#071838]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
              {program.batch}
            </Badge>
            <Badge className={program.status === "Completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1" : "bg-amber-500/20 text-amber-300 border-amber-500/30 px-3 py-1"}>
              {program.status}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            {program.title}
          </h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
            {program.description}
          </p>
        </div>
        
        {isAdmin && (
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 shrink-0">
            <Edit className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>

      {/* The Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Location Box */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-md hover:bg-white/10 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">Location</p>
              <p className="font-semibold text-white text-lg">{program.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* Start Date Box */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-md hover:bg-white/10 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">Start Date</p>
              <p className="font-semibold text-white text-lg">{program.startDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* End Date Box */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-md hover:bg-white/10 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">End Date</p>
              <p className="font-semibold text-white text-lg">{program.endDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Participants Box */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-md hover:bg-white/10 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">Total Participants</p>
              <p className="font-semibold text-white text-lg">{program.participants}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Box */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-md hover:bg-white/10 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">Active Mentors</p>
              <p className="font-semibold text-white text-lg">{program.mentors}</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* NEW SECTION: Core Team */}
      {program.team && program.team.length > 0 && (
        <div className="pt-8 mt-4 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Core Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {program.team.map((name, index) => (
              <div key={index} className="flex items-center gap-3 bg-[#071838]/80 border border-white/10 p-3.5 rounded-2xl hover:bg-white/10 transition-colors shadow-sm">
                <img 
                  src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`} 
                  alt={name} 
                  className="w-12 h-12 shrink-0 rounded-full border-2 border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm truncate">{name}</p>
                  <p className="text-xs text-blue-400 truncate mt-0.5">Team Member</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgramDetailView;