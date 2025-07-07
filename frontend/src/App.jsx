import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./dashboardPages/UserDashboard";
import UploadExcel from "./dashboardPages/subdasboard/UploadExcel";
import History from "./dashboardPages/subdasboard/History";
import Profile from "./dashboardPages/subdasboard/Profile";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="upload-excel" element={<UploadExcel />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
