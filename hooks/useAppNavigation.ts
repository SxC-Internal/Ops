import { useCallback, useState } from "react";
import { View } from "@/types";

export function useAppNavigation(initialView: View = View.PM_DASHBOARD) {
  const [activeView, setActiveView] = useState<View>(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navigate = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  const navigateFromMobile = useCallback((view: View) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  return {
    activeView,
    setActiveView,
    isMobileMenuOpen,
    isSidebarCollapsed,
    openMobileMenu,
    closeMobileMenu,
    navigate,
    navigateFromMobile,
    toggleSidebar,
  };
}
