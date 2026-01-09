"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  { name: "Products", href: "/shop" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white h-screen transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          {!collapsed && <span className="font-bold text-lg">Admin</span>}
          <button onClick={() => setCollapsed(!collapsed)}>menuicon</button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-800 transition-colors"
            >
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
    </div>
  );
}
