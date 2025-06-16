"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionSyncer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessToken: session.accessToken }),
      });
    }
  }, [status, session]);

  return null; // Không render gì ra UI
}