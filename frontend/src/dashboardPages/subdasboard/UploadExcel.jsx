import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload, faChartLine } from "@fortawesome/free-solid-svg-icons";

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
    <div className="mx-auto p-10 bg-gray-50 shadow-xl rounded-xl mt-12">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Unleash Insights from Your Excel Data
      </h1>

      <label className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-indigo-700 transition duration-300 ease-in-out">
        <FontAwesomeIcon icon={faFileUpload} className="mr-3" />
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <span>{fileName ? `Uploaded: ${fileName}` : "Select Excel File"}</span>
      </label>

      {data.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out mx-auto block">
            <FontAwesomeIcon icon={faChartLine} className="mr-3" />
            Analyze Data
          </button>

          <div className="overflow-x-auto mt-8 border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white border-collapse rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0]).map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-100">
                    {Object.keys(row).map((key, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
    </div>
  );
}
