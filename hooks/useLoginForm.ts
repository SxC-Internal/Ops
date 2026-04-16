import { useCallback, useState, type FormEvent } from "react";
import type { User } from "@/types";
import { createUserFromCredentials } from "@/lib/auth";

export function useLoginForm(onLogin: (user: User) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const { user, error: newError } = createUserFromCredentials(email, password);

      if (user) {
        console.log("LOGGED IN USER:", user);
        setError("");
        onLogin(user);
        return;
      }

      setError(newError ?? "Login failed.");
    },
    [email, password, onLogin],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    handleSubmit,
  };
}
