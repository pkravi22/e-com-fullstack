"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }: any) {
  const [queryClient] = useState(() => {
    console.log("QueryClient CREATED ON CLIENT ✅");
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
