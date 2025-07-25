// src/Dashboard.jsx

import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faHistory,
  faLightbulb,
  faUser,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const tabs = [
    { name: "Upload-Excel", icon: faUpload },
    { name: "History", icon: faHistory },
    { name: "Insights", icon: faLightbulb },
    { name: "Profile", icon: faUser },
    { name: "Settings", icon: faCog },
  ];

  const [selectedTab, setSelectedTab] = useState("Upload Excel");

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-8 flex flex-col shadow-xl rounded-r-3xl border-r border-indigo-300">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-lg">Excel Analytics</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-3">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <NavLink
                  to={`/dashboard/${tab.name.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-3 px-5 rounded-xl font-semibold text-lg transition-all duration-200 ease-in-out shadow-sm
                    ${isActive
                      ? "bg-indigo-500 text-white shadow-md scale-105"
                      : "hover:bg-indigo-600 hover:text-white text-indigo-200"
                    }`
                  }
                  onClick={() => setSelectedTab(tab.name)}>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-800/60">
                    <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
                  </span>
                  <span>{tab.name.replace("-", " ")}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center pt-8">
          <p className="text-indigo-300 text-sm font-medium">
            &copy; {new Date().getFullYear()} Zidio Inc.
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100 min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
