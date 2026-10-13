import { useEffect, useState } from "react";
import { initHub, requireUser, signIn } from "./hub-client.ts";

// Sign-in comes from the class hub: one Google sign-in for every class app.
initHub();

export const hubHome = (process.env.REACT_APP_HUB_URL || "").replace(/\/$/, "") || "/";

export const isStaff = (user) => user?.role === "admin" || user?.role === "ta";

// The signed-in hub person; visitors without a session are sent to the hub's sign-in first.
export function useHubUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    requireUser().then(setUser).catch((err) => {
      console.error("Class hub unreachable:", err);
      setError(true);
    });
  }, []);
  return { user, error };
}

// fetch() for this app's /api functions (they read the hub cookie). When the session has expired,
// go back through the hub's sign-in, which returns here.
export async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    signIn();
    return new Promise(() => {});
  }
  return res;
}
