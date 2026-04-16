"use client";

import React from "react";
import Link from "next/link";
import { DIVISIONS, type Division } from "@/lib/divisions";

// Real photos per division from Unsplash (free, auto-sized)
const divisionPhotos: Record<string, string> = {
    operations: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    marketing:  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    hr:         "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    tech:       "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    finance:    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
};

const DivisionCard: React.FC<{ division: Division }> = ({ division }) => {
    const photo = divisionPhotos[division.id];

    const card = (
        <div
            className={`
                relative overflow-hidden rounded-2xl h-44 flex items-end justify-center pb-5
                transition-all duration-300
                ${division.active
                    ? "cursor-pointer hover:scale-[1.03] hover:shadow-2xl"
                    : "cursor-not-allowed opacity-60 grayscale"}
                group
            `}
        >
            {/* Background photo */}
            <img
                src={photo}
                alt={division.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Text */}
            <div className="relative z-10 text-center px-3">
                <span className="text-white font-bold text-lg drop-shadow-lg block leading-tight">{division.name}</span>
                {!division.active && (
                    <span className="text-white/60 text-xs mt-1 block">Coming Soon</span>
                )}
            </div>
        </div>
    );

    if (division.active) {
        return <Link href={division.url} className="block">{card}</Link>;
    }
    return card;
};

export default function PortalPage() {
    const topRow = DIVISIONS.slice(0, 3);
    const bottomRow = DIVISIONS.slice(3);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            {/* ── NAV ───────────────────────────────────────── */}
            <nav className="bg-white border-b border-slate-100 px-10 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#1a3a6e] rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xs">SxC</span>
                    </div>
                    <span className="font-bold text-[#1a3a6e] text-base hidden sm:block">StudentsXCeos</span>
                </div>
                <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="text-[#1a3a6e] font-semibold">Home</a>
                    <a href="#departments" className="hover:text-[#1a3a6e] transition-colors">Departments</a>
                </div>
            </nav>

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="relative bg-[#1a3a6e] text-white overflow-hidden min-h-[420px] flex items-center">
                {/* Hero background photo */}
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
                    alt="Team"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#1a3a6e]/80" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
                />

                <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-24">
                    <h1 className="text-4xl md:text-[3.25rem] font-extrabold mb-4 leading-tight tracking-tight">
                        Welcome to the SxC Internal Hub.
                    </h1>
                    <p className="text-blue-200 text-base md:text-lg mb-10 font-medium">
                        Your gateway to all division portals and internal tools.
                    </p>
                    <a
                        href="#departments"
                        className="inline-block bg-white text-[#1a3a6e] font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all text-sm"
                    >
                        Select Your Department
                    </a>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────── */}
            <section className="bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-8 py-10 grid grid-cols-3 divide-x divide-slate-100 text-center">
                    {[
                        { value: "16", label: "Active Members" },
                        { value: "5",  label: "Departments" },
                        { value: "2026", label: "Est. Year" },
                    ].map((s) => (
                        <div key={s.label} className="px-6">
                            <span className="block text-4xl font-extrabold text-[#1a3a6e]">{s.value}</span>
                            <span className="text-slate-500 text-sm font-medium">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── DEPARTMENTS ───────────────────────────────── */}
            <section id="departments" className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#0d2044] rounded-3xl px-8 py-14">
                        <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                            Explore Our Departments
                        </h2>
                        <p className="text-blue-200 text-center text-sm mb-10 font-medium">
                            Choose your division to sign in and access your team's internal tools.
                        </p>

                        {/* Top row: 3 cards */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {topRow.map((d) => <DivisionCard key={d.id} division={d} />)}
                        </div>

                        {/* Bottom row: 2 centered */}
                        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {bottomRow.map((d) => <DivisionCard key={d.id} division={d} />)}
                        </div>

                        {/* CTA */}
                        <div className="flex justify-center mt-10">
                            <Link
                                href="/"
                                className="bg-white text-[#0d2044] font-bold px-10 py-3.5 rounded-full shadow-md hover:shadow-xl hover:bg-blue-50 transition-all text-sm"
                            >
                                Enter Operations Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────── */}
            <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 font-medium">
                &copy; 2026 StudentsXCeos · Internal Use Only
            </footer>
        </div>
    );
}
