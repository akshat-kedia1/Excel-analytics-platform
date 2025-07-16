// src/ExcelViewer.jsx

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 → array of arrays

      setData(json);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow rounded overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Select Excel file to analyze</h1>

      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileUpload}
        className="mb-6"
      />

      {data.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              {data[0].map((header, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="border border-gray-300 px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
