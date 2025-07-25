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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">Excel Analytics</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <NavLink
                  to={`/dashboard/${tab.name.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ease-in-out
                    ${isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                  onClick={() => setSelectedTab(tab.name)}>
                  <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
                  <span>{tab.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Zidio Inc.
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
