"use client";

import Sidebar from "@/components/mycomponents/Sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 bg-slate-50 p-6">{children}</main>
    </div>
  );
}
