import { useCallback } from "react";
import { View } from "@/types";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAuthState } from "@/hooks/useAuthState";
import { useThemeState } from "@/hooks/useTheme";

export function useAppController() {
  const auth = useAuthState();
  const nav = useAppNavigation(View.PM_DASHBOARD);
  const theme = useThemeState("dark");

  const handleLogin = useCallback(
    (user: any) => {
      auth.login(user);
      nav.navigate(View.PM_DASHBOARD);
    },
    [auth, nav],
  );

  const handleLogout = useCallback(async () => {
    await auth.logout();
    nav.navigate(View.PM_DASHBOARD);
  }, [auth, nav]);

  return {
    ...auth,
    ...nav,
    ...theme,
    handleLogin,
    handleLogout,
  };
}
