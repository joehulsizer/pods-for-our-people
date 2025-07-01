"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/NotificationSystem";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <AuthProvider>
        <NotificationProvider>
          {children}
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}
