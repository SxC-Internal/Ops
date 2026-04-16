"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Tell the component it can accept an onClick function
interface ParticipantChartProps {
  onClick?: () => void;
}

const chartData = [
  { batch: "Batch 10", participants: 400 },
  { batch: "Batch 11", participants: 150 },
  { batch: "Batch 12", participants: 200 },
  { batch: "Batch 13", participants: 570 },
  { batch: "Batch 14", participants: 550 },
];

const ParticipantChart: React.FC<ParticipantChartProps> = ({ onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className={`bg-[#071838]/60 backdrop-blur-xl border-white/10 shadow-2xl h-full flex flex-col transition-all duration-300 ${
        onClick ? "cursor-pointer hover:border-blue-500/50 hover:bg-[#071838]/80 hover:-translate-y-1" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Participant Growth
        </CardTitle>
        <CardDescription className="text-slate-400">
          Total attendees across all historical batches.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="batch" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                color: '#fff' 
              }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Bar 
              dataKey="participants" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ParticipantChart;