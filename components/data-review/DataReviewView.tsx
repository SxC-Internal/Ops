"use client";

import React from "react";
import { Database, LineChart, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Shared chart components (moved from old dashboard)
import ParticipantChart from "./ParticipantChart";
import EventTimeline from "./EventTimeline";

const DataReviewView = () => {
  return (
    <div className="animate-fade-in p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#071838]/40 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Database className="text-blue-500 w-8 h-8" />
            Data Review
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Analyze historical data, raw metrics, and organizational growth.
          </p>
        </div>
      </div>

      {/* The Shadcn Tabs System */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#071838]/60 border border-white/10 p-1 rounded-xl mb-8">
          <TabsTrigger value="raw" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <Table2 className="w-4 h-4 mr-2" /> Raw Data
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
            <LineChart className="w-4 h-4 mr-2" /> Visual Analytics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Raw Data (Your existing stuff goes here) */}
        <TabsContent value="raw" className="animate-in fade-in-50 duration-500">
          <div className="p-16 text-center border border-dashed border-white/20 rounded-2xl bg-black/20">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Data Tables</h3>
            <p className="text-slate-400">Your existing data grids and tables will go here.</p>
          </div>
        </TabsContent>

        {/* TAB 2: Analytics Hub (Where the full graphs live!) */}
        <TabsContent value="analytics" className="animate-in fade-in-50 duration-500 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notice we don't pass onClick here, so they act as static, full displays! */}
            <div className="lg:col-span-1">
              <ParticipantChart />
            </div>
            <div className="lg:col-span-1">
              <EventTimeline />
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default DataReviewView;