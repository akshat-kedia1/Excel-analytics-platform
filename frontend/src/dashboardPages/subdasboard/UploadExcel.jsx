// src/UploadExcel.jsx

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function UploadExcel() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // ✅ NEW: use default sheet_to_json → gives array of objects!
      const json = XLSX.utils.sheet_to_json(sheet);

      setData(json);
    };
    reader.readAsBinaryString(file);
  };

  const handleAnalyze = () => {
    navigate("/dashboard/analyze", { state: { data } });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>

      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <span>{fileName ? fileName : "Choose File"}</span>
      </label>

      {data.length > 0 && (
        <>
          <button
            onClick={handleAnalyze}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Analyze Data →
          </button>

          <div className="overflow-x-auto mt-6 border border-gray-300">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((header, idx) => (
                    <th key={idx} className="border px-4 py-2 bg-gray-100">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {Object.keys(row).map((key, cellIdx) => (
                      <td key={cellIdx} className="border px-4 py-2">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
