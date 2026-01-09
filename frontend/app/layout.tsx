"use client";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 1️⃣ Redux Provider for auth */}
        <Provider store={store}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </Provider>
      </body>
    </html>
  );
}
