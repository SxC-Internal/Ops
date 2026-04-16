"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EventTimelineProps {
  onClick?: () => void;
}

const allTimelineEvents = [
  { id: 1, title: "SxC Grand Summit 2026", batch: "Batch 14", date: "Aug 20, 2026", status: "Upcoming" },
  { id: 2, title: "FMCG Marketing Workshop", batch: "Batch 13", date: "Oct 10, 2025", status: "Completed" },
  { id: 3, title: "Jakarta Leadership Summit", batch: "Batch 13", date: "Aug 15, 2025", status: "Completed" },
  { id: 4, title: "Tech Startup Bootcamp", batch: "Batch 12", date: "Feb 20, 2024", status: "Completed" },
  { id: 5, title: "Finance Strategy Masterclass", batch: "Batch 11", date: "Nov 05, 2023", status: "Completed" },
  { id: 6, title: "National Business Case", batch: "Batch 10", date: "May 12, 2022", status: "Completed" },
];

const EventTimeline: React.FC<EventTimelineProps> = ({ onClick }) => {
  const [visibleCount, setVisibleCount] = useState(onClick ? 4 : 5);

  const visibleEvents = allTimelineEvents.slice(0, visibleCount);
  const hasMore = visibleCount < allTimelineEvents.length;

  const handleViewMore = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    e.stopPropagation();
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <Card 
      onClick={onClick}
      className={`bg-[#071838]/60 backdrop-blur-xl border-white/10 shadow-2xl h-full flex flex-col transition-all duration-300 ${
        onClick ? "cursor-pointer hover:border-blue-500/50 hover:bg-[#071838]/80 hover:-translate-y-1" : ""
      }`}
    >
      <CardHeader className="shrink-0">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Timeline & Milestones
        </CardTitle>
        <CardDescription className="text-slate-400">
          Swipe or scroll to explore historical events.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden relative pb-2">
        {/* Scrollable Container */}
        <div className="flex flex-row overflow-x-auto snap-x scroll-smooth pb-4 pt-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* The Wrapper that gives us the total height for the up/down effect */}
          <div className="relative flex items-center h-[260px] min-w-max">
            
            {/* The continuous central horizontal line */}
            <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-slate-700/50 -translate-y-1/2 z-0"></div>

            {visibleEvents.map((event, index) => {
              const isCompleted = event.status === "Completed";
              // This simple math check tells us if the item is Even (Top) or Odd (Bottom)
              const isUp = index % 2 === 0;

              return (
                <div key={event.id} className="relative w-[150px] shrink-0 h-full flex flex-col items-center snap-center group px-1">
                  
                  {/* TOP HALF (Only renders the card here if it's an EVEN index) */}
                  <div className="flex-1 w-full flex flex-col justify-end items-center pb-3 relative">
                    {isUp && (
                      <>
                        <div className="w-full p-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-sm transition-colors group-hover:bg-white/10 relative z-10 hover:-translate-y-1 duration-200">
                          <div className="flex flex-col items-center text-center mb-1">
                            <span className="text-xs font-semibold text-blue-400 mb-0.5">{event.batch}</span>
                            <span className="text-[10px] text-slate-400 font-medium bg-black/30 px-2 py-0.5 rounded-full">{event.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white text-center leading-tight line-clamp-2 mt-1">
                            {event.title}
                          </h4>
                        </div>
                        {/* Tiny connector line pointing down to the dot */}
                        <div className="absolute bottom-0 w-0.5 h-3 bg-slate-600"></div>
                      </>
                    )}
                  </div>

                  {/* CENTER DOT (Always rendered in the exact middle) */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#071838] bg-[#071838] shadow z-10 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    )}
                  </div>

                  {/* BOTTOM HALF (Only renders the card here if it's an ODD index) */}
                  <div className="flex-1 w-full flex flex-col justify-start items-center pt-3 relative">
                    {!isUp && (
                      <>
                        {/* Tiny connector line pointing up to the dot */}
                        <div className="absolute top-0 w-0.5 h-3 bg-slate-600"></div>
                        <div className="w-full p-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-sm transition-colors group-hover:bg-white/10 relative z-10 hover:translate-y-1 duration-200">
                          <div className="flex flex-col items-center text-center mb-1">
                            <span className="text-xs font-semibold text-blue-400 mb-0.5">{event.batch}</span>
                            <span className="text-[10px] text-slate-400 font-medium bg-black/30 px-2 py-0.5 rounded-full">{event.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white text-center leading-tight line-clamp-2 mt-1">
                            {event.title}
                          </h4>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              );
            })}

            {/* View More Button (Sits at the very end of the line, perfectly centered) */}
            {(hasMore || onClick) && (
              <div className="relative flex items-center justify-center w-[130px] shrink-0 h-full snap-center z-10 ml-2">
                <button 
                  onClick={handleViewMore}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-slate-400 hover:text-blue-400 w-full h-[100px]"
                >
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-xs font-medium text-center">
                    {onClick ? "View All Batches" : "Load Older Batches"}
                  </span>
                </button>
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTimeline;