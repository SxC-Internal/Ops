"use client";

import React, { useState, useMemo } from "react";
import { Search, Folder, FileText, FileSpreadsheet, Star, Calendar, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OpsBatch } from "./opsData";

interface BatchContentProps {
  batch: OpsBatch;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "Sheet": return <FileSpreadsheet className="text-emerald-400 w-5 h-5" />;
    case "Doc": return <FileText className="text-blue-400 w-5 h-5" />;
    case "PDF": return <FileText className="text-rose-400 w-5 h-5" />;
    default: return <Folder className="text-amber-400 w-5 h-5" />;
  }
};

const BatchContent: React.FC<BatchContentProps> = ({ batch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return batch.allDocs;
    const query = searchQuery.toLowerCase();
    return batch.allDocs.filter(doc => 
      doc.name.toLowerCase().includes(query) || 
      doc.category.toLowerCase().includes(query)
    );
  }, [searchQuery, batch.allDocs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* SECTION A: Hero Overview */}
      <div className="bg-[#071838]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={batch.status === "Active" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-slate-500/20 text-slate-300 border-slate-500/30"}>
                {batch.status}
              </Badge>
              <span className="text-slate-400 font-medium">{batch.year}</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{batch.name}</h1>
            <p className="text-xl text-blue-300">"{batch.theme}"</p>
          </div>
          <div className="flex gap-6 bg-black/20 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Project Officer</p>
              <p className="text-white font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-blue-400"/> {batch.po}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vice PO</p>
              <p className="text-white font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-purple-400"/> {batch.vpo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Major Events */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" /> Major Events Executed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batch.events.map(event => (
            <Card key={event.id} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{event.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{event.date}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{event.attendees} Attendees</Badge>
                  <p className="text-xs text-slate-400 font-mono">{event.budget}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION C: Pinned Documents (The "Gold") */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" /> Pinned Master Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {batch.pinnedDocs.map(doc => (
            <div key={doc.id} className="group bg-gradient-to-b from-[#0a1f4d] to-[#071838] p-5 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all cursor-pointer shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/10 p-2 rounded-lg">{getFileIcon(doc.type)}</div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <h4 className="text-white font-medium mb-1 truncate" title={doc.name}>{doc.name}</h4>
              <p className="text-xs text-blue-300">{doc.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: All Documents Directory */}
      <Card className="bg-white dark:bg-[#071838]/40 backdrop-blur-md border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-lg text-slate-900 dark:text-white">Batch Directory</CardTitle>
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg px-3 py-2 w-full sm:w-72 border border-slate-200 dark:border-slate-700 focus-within:ring-1 focus-within:ring-blue-500">
            <Search size={16} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search drive files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  {getFileIcon(doc.type)}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className="dark:border-slate-700 dark:text-slate-300 bg-transparent">{doc.category}</Badge>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <div className="p-8 text-center text-slate-500">No files found matching "{searchQuery}"</div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default BatchContent;