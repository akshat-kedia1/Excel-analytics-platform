// src/UploadExcel.jsx

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faChartLine,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadExcel() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected.");
      setUploadSuccess(false);
      return;
    }
    setFileName(file.name);
    setUploadError("");
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        setData(json);
        setUploadSuccess(true);
      } catch (err) {
        setUploadError(
          "Failed to parse Excel file. Please upload a valid file."
        );
        setUploadSuccess(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleAnalyze = () => {
    navigate("/dashboard/analyze", { state: { data } });
  };

  return (
    <div className="max-w-5xl mx-auto p-0 md:p-10 bg-gradient-to-br from-indigo-50 via-white to-green-50 shadow-2xl rounded-3xl mt-12 border border-gray-200 animate-fade-in">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 text-center drop-shadow-lg tracking-tight animate-slide-down">
          <span className="bg-gradient-to-r from-indigo-500 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Excel Data Analyzer
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl animate-fade-in">
          Upload your Excel file and instantly preview your data. Click{" "}
          <span className="font-semibold text-green-600">Analyze</span> to
          unlock insights!
        </p>

        <label className="relative inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-indigo-700 transition duration-300 ease-in-out animate-pop">
          <FontAwesomeIcon icon={faFileUpload} className="mr-4 text-2xl" />
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="font-semibold text-lg">
            {fileName ? `Uploaded: ${fileName}` : "Select Excel File"}
          </span>
          {uploadSuccess && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="ml-4 text-green-400 animate-bounce"
              title="Upload successful"
            />
          )}
          {uploadError && (
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="ml-4 text-red-400 animate-shake"
              title="Upload error"
            />
          )}
        </label>

        {uploadError && (
          <div className="mt-2 text-red-600 text-sm animate-fade-in">
            {uploadError}
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-10 animate-fade-in">
          <button
            onClick={handleAnalyze}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition duration-300 ease-in-out text-xl font-bold animate-pop">
            <FontAwesomeIcon icon={faChartLine} className="mr-4 text-2xl" />
            Analyze Data
          </button>

          <div className="overflow-x-auto mt-10 border border-gray-300 rounded-2xl shadow-lg bg-white animate-fade-in">
            <table className="min-w-full bg-white border-collapse rounded-2xl">
              <thead className="bg-gradient-to-r from-indigo-100 to-green-100">
                <tr>
                  {Object.keys(data[0]).map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-4 text-left text-sm font-bold text-indigo-700 uppercase tracking-wider border-b border-gray-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-indigo-50 transition duration-200">
                    {Object.keys(row).map((key, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tailwind Custom Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s ease; }
        .animate-slide-down { animation: slideDown 0.7s cubic-bezier(.4,0,.2,1); }
        .animate-pop { animation: popIn 0.5s cubic-bezier(.4,0,.2,1); }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-shake { animation: shake 0.5s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-4px); } 100% { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
