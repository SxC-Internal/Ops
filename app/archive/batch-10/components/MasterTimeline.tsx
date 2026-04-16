"use client";

import React from 'react';
import { BATCH_10_TIMELINE } from '../data';

export default function MasterTimeline() {
    return (
        <div className="relative border-l border-neutral-800 ml-3 md:ml-6 space-y-8 py-4">
            {BATCH_10_TIMELINE.map((item, index) => (
                <div key={index} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div className="absolute w-4 h-4 rounded-full bg-neutral-900 border-2 border-blue-500/50 -left-[9px] top-1 group-hover:border-blue-400 group-hover:bg-blue-500/20 transition-colors" />

                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-blue-400">{item.month}</span>
                        <ul className="space-y-2 mt-2">
                            {item.events.map((evt, idx) => (
                                <li key={idx} className="text-neutral-300 text-sm bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 shadow-sm leading-relaxed">
                                    {evt}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
