"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { makeQueryClient } from "@/lib/query-client";
import { useAuthStore } from "@/lib/auth-store";
import { useMe } from "@/hooks/useAuth";

let browserClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
}

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.accessToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [hydrate]);

  useMe(mounted && !!token && hydrated);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => getQueryClient());
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <NuqsAdapter>
        <QueryClientProvider client={client}>
          <AuthHydrator>{children}</AuthHydrator>
          <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
