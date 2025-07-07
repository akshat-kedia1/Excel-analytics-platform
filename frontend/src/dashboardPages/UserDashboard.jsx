// src/Dashboard.jsx

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  const tabs = ["Upload-Excel", "History", "Insights", "Profile", "Settings"];

  const [selectedTab, setSelectedTab] = useState("Upload Excel");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Excel Analytics</h1>
        <div className="space-y-4 flex flex-col gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab}
              className={`cursor-pointer ${
                selectedTab === tab ? "text-blue-400 font-semibold" : ""
              }`}
              to={`/dashboard/${tab.toLowerCase()}`}>
              {tab}
            </Link>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="w-4/5 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
