import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faLightbulb,
  faUser,
  faCog,
  faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Dashboard() {
  const tabs = [
    { name: "Upload-Excel", icon: faUpload },
    { name: "My-Projects", icon: faProjectDiagram },
    { name: "Insights", icon: faLightbulb },
    { name: "Profile", icon: faUser },
    { name: "Settings", icon: faCog },
  ];

  const [selectedTab, setSelectedTab] = useState("Upload Excel");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users/me", {
          withCredentials: true,
        });
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (err) {
        setUser(null); // Not logged in
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-8 flex flex-col shadow-xl border-r border-indigo-300">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-lg">
            Excel Analytics
          </h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-3">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <NavLink
                  to={`/dashboard/${tab.name.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-3 px-5 rounded-xl font-semibold text-lg transition-all duration-200 ease-in-out shadow-sm
                    ${
                      isActive
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
        <div className="mt-auto pt-8 px-5">
          {user ? (
            <div className="flex items-center gap-3 p-3 bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-500 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="text-white text-sm font-semibold truncate">
                {user.fullname.firstname + " " + user.fullname.lastname}
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 p-3 bg-white text-indigo-900 rounded-xl shadow hover:bg-indigo-100 transition-all font-semibold text-sm">
              <FontAwesomeIcon icon={faUser} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="w-full bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
