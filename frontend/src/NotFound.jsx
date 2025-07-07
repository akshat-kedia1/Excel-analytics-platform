// src/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import notFoundAnimation from "./404.json";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="w-72 h-40">
        <Lottie animationData={notFoundAnimation} loop={true} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist or was moved.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-[#1E2939] text-white rounded-lg hover:bg-[#1E2939]/80 transition">
        Go Back Home
      </Link>
    </div>
  );
}
