"use client";

import React, { useState } from "react";
import { Package, Truck, CheckCircle2, ChevronRight } from "lucide-react";

type Status = "Ordered" | "In Progress" | "Finished";

interface Item {
    id: number;
    name: string;
    qty: number;
    status: Status;
}

const INITIAL_ITEMS: Item[] = [
    { id: 1, name: "Name Tags & Lanyards", qty: 250, status: "Finished" },
    { id: 2, name: "Speaker Goodie Bags", qty: 15, status: "In Progress" },
    { id: 3, name: "Stage Banners", qty: 2, status: "Ordered" },
    { id: 4, name: "Catering Meal Boxes (VIP)", qty: 50, status: "Ordered" },
    { id: 5, name: "Walkie Talkies", qty: 20, status: "In Progress" },
];

const LogisticsChecklist: React.FC = () => {
    const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

    const toggleStatus = (id: number) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const nextStatus: Record<Status, Status> = {
                "Ordered": "In Progress",
                "In Progress": "Finished",
                "Finished": "Ordered"
            };
            return { ...item, status: nextStatus[item.status] };
        }));
    };

    const getStatusStyle = (status: Status) => {
        switch (status) {
            case "Finished": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
            case "In Progress": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
            case "Ordered": return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
        }
    };

    const getStatusIcon = (status: Status) => {
        switch (status) {
            case "Finished": return <CheckCircle2 size={14} className="mr-1" />;
            case "In Progress": return <Truck size={14} className="mr-1" />;
            case "Ordered": return <Package size={14} className="mr-1" />;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Package size={18} />
                    </div>
                    D-Day Logistics Needs
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                    {items.filter(i => i.status === 'Finished').length} / {items.length} Ready
                </span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                        onClick={() => toggleStatus(item.id)}
                    >
                        <div className="flex flex-col">
                            <span className={`text-sm font-medium transition-colors ${item.status === 'Finished' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                {item.name}
                            </span>
                            <span className="text-xs text-slate-400 mt-0.5">Qty: {item.qty}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded border ${getStatusStyle(item.status)}`}>
                                {getStatusIcon(item.status)}
                                {item.status}
                            </span>
                            <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogisticsChecklist;
