"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  X,
  LogOut,
  KanbanSquare,
  GanttChart,
  Lightbulb,
  Database,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { View } from "@/types";
import type { User } from "@/types";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  currentUser: User;
  activeView: View;
  navigate: (view: View) => void;
  navigateFromMobile: (view: View) => void;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", view: View.PM_DASHBOARD },
  { icon: KanbanSquare, label: "Tasks", view: View.KANBAN },
  { icon: GanttChart, label: "Roadmap", view: View.ROADMAP },
  { icon: Lightbulb, label: "Brainstorm", view: View.BRAINSTORM },
  { icon: Database, label: "DDR", view: View.DDR },
  { icon: BarChart3, label: "Tracking", view: View.TRACKING },
  { icon: Users, label: "Members", view: View.MEMBERS },
  { icon: Settings, label: "Settings", view: View.SETTINGS },
];

const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  navigate,
  navigateFromMobile,
  handleLogout,
  isMobileMenuOpen,
  closeMobileMenu,
  isCollapsed,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-20 h-screen ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Top section: Logo */}
        <div className={`shrink-0 ${isCollapsed ? "p-3 pb-2" : "p-6 pb-2"}`}>
          <div className={`flex items-center mb-4 ${isCollapsed ? "justify-center" : "space-x-2"} text-blue-500`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 shrink-0">
              S
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Students<span className="text-blue-500">x</span>CEOs
              </span>
            )}
          </div>
        </div>

        {/* Middle section: Scrollable nav */}
        <div className={`flex-1 overflow-y-auto min-h-0 ${isCollapsed ? "px-3" : "px-6"}`}>
          {!isCollapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">
              Project Management
            </p>
          )}
          <nav className="space-y-0.5">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <SidebarItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.view}
                isCollapsed={isCollapsed}
                onClick={() => navigate(item.view)}
              />
            ))}

            <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
            {!isCollapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">
                Organization
              </p>
            )}

            {NAV_ITEMS.slice(6).map((item) => (
              <SidebarItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.view}
                isCollapsed={isCollapsed}
                onClick={() => navigate(item.view)}
              />
            ))}
          </nav>
        </div>

        {/* Bottom section: User info + collapse toggle (always visible, pinned) */}
        <div className={`shrink-0 border-t border-slate-200 dark:border-slate-800 ${isCollapsed ? "p-3" : "px-6 py-4"}`}>
          {/* User info */}
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 mb-3">
              <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <img src={currentUser.avatar} alt="User" title={currentUser.name} className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-600" />
            </div>
          )}

          {/* Sign out + Collapse toggle row */}
          <div className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "justify-between"}`}>
            {!isCollapsed ? (
              <button onClick={handleLogout} className="flex items-center text-xs text-slate-500 hover:text-rose-500 transition-colors">
                <LogOut size={14} className="mr-2" /> Sign Out
              </button>
            ) : (
              <button onClick={handleLogout} title="Sign Out" className="flex justify-center text-slate-400 hover:text-rose-500 transition-colors w-full">
                <LogOut size={16} />
              </button>
            )}

            <button
              onClick={toggleSidebar}
              className={`flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isCollapsed ? "w-full py-2" : "w-8 h-8"
                }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeMobileMenu}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <button onClick={closeMobileMenu} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="flex items-center space-x-2 text-blue-500 mb-6 mt-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Students<span className="text-blue-500">x</span>CEOs
              </span>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">
              Project Management
            </p>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {NAV_ITEMS.slice(0, 6).map((item) => (
                <SidebarItem
                  key={item.view}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeView === item.view}
                  onClick={() => navigateFromMobile(item.view)}
                />
              ))}

              <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">
                Organization
              </p>

              {NAV_ITEMS.slice(6).map((item) => (
                <SidebarItem
                  key={item.view}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeView === item.view}
                  onClick={() => navigateFromMobile(item.view)}
                />
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                <button onClick={handleLogout} className="flex items-center text-slate-500 hover:text-rose-500 transition-colors w-full">
                  <LogOut size={18} className="mr-3" /> Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;