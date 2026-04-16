import { useCallback, useEffect, useState } from "react";
import type { User } from "@/types";
import { authClient } from "@/lib/auth-client";
import { APPROVED_EMAILS } from "@/lib/auth";

export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // On mount, check if a Better Auth session already exists (e.g. after redirect back from Google)
  useEffect(() => {
    authClient.getSession().then((result: any) => {
      const sessionUser = result?.data?.user;
      if (sessionUser?.email) {
        const email = sessionUser.email.toLowerCase();
        const membershipRole = APPROVED_EMAILS[email] ?? "member";
        const user: User = {
          id: sessionUser.id,
          name: sessionUser.name ?? email,
          email,
          role: "ops",
          departmentId: "ops",
          membershipRole,
          avatar: sessionUser.image ?? undefined,
        };
        setCurrentUser(user);
      }
      setIsLoadingSession(false);
    });
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isLoadingSession,
    login,
    logout,
  };
}
