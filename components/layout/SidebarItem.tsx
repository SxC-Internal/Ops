"use client";

import React from "react";
import type { ComponentType } from "react";

interface SidebarItemProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  isActive: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive,
  isCollapsed = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`flex items-center w-full rounded-lg transition-all duration-200 group ${isCollapsed ? "justify-center px-2 py-3 mb-1" : "px-4 py-3 mb-2"
      } ${isActive
        ? "bg-blue-500/10 text-blue-500 border-r-2 border-blue-500"
        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
  >
    <Icon
      size={20}
      className={`${isCollapsed ? "" : "mr-3"} shrink-0 ${isActive
          ? "text-blue-500"
          : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
        }`}
    />
    {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
  </button>
);

export default SidebarItem;
