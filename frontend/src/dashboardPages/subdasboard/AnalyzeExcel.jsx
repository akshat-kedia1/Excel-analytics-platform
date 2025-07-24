import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyzeExcel() {
  const navigate = useNavigate();
  const location = useLocation();
  const excelData = location.state?.data || [];

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  const [blocks, setBlocks] = useState([
    { xColumn: "", yColumn: "", chartType: "line", enabled: true },
  ]);

  const chartRefs = useRef([React.createRef()]);

  const addBlock = () => {
    setBlocks([
      ...blocks,
      { xColumn: "", yColumn: "", chartType: "line", enabled: true },
    ]);
    chartRefs.current.push(React.createRef());
  };

  const updateBlock = (index, field, value) => {
    const updated = blocks.map((b, i) =>
      i === index ? { ...b, [field]: value } : b
    );
    setBlocks(updated);
  };

  const toggleEnabled = (index) => {
    const updated = blocks.map((b, i) =>
      i === index ? { ...b, enabled: !b.enabled } : b
    );
    setBlocks(updated);
  };

  const downloadPNG = (index) => {
    const ref = chartRefs.current[index];
    if (ref?.current) {
      const base64 = ref.current.toBase64Image();
      const link = document.createElement("a");
      link.href = base64;
      link.download = `chart-${index + 1}.png`;
      link.click();
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let yOffset = 10;

    blocks.forEach((block, idx) => {
      if (block.enabled && chartRefs.current[idx]?.current) {
        const base64 = chartRefs.current[idx].current.toBase64Image();
        pdf.addImage(base64, "PNG", 10, yOffset, 180, 90);
        yOffset += 100;
        if (idx < blocks.length - 1) {
          pdf.addPage();
          yOffset = 10;
        }
      }
    });

    pdf.save("selected-charts.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-8">Analyze Uploaded Excel Data</h1>

      {blocks.map((block, index) => {
        const labels = excelData.map((row) => row[block.xColumn]);
        const values = excelData.map((row) => Number(row[block.yColumn]));

        const chartData = {
          labels,
          datasets: [
            {
              label: `${block.yColumn} vs ${block.xColumn}`,
              data: values,
              fill: false,
              backgroundColor: [
                "#60a5fa",
                "#34d399",
                "#fbbf24",
                "#f87171",
                "#a78bfa",
                "#f472b6",
                "#38bdf8",
              ],
              borderColor: "rgb(37, 99, 235)",
              tension: 0.1,
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            x: { title: { display: true, text: block.xColumn } },
            y: { title: { display: true, text: block.yColumn } },
          },
        };

        return (
          <div
            key={index}
            className="mb-12 p-4 border border-gray-300 rounded shadow">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={block.enabled}
                onChange={() => toggleEnabled(index)}
                className="mr-2"
              />
              <span className="font-semibold">Graph #{index + 1}</span>
            </div>

            <label className="block mb-2 font-semibold">Select X-axis:</label>
            <select
              className="border p-2 mb-4 w-full"
              value={block.xColumn}
              onChange={(e) => updateBlock(index, "xColumn", e.target.value)}>
              <option value="">-- Select X-axis --</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Select Y-axis:</label>
            <select
              className="border p-2 mb-4 w-full"
              value={block.yColumn}
              onChange={(e) => updateBlock(index, "yColumn", e.target.value)}>
              <option value="">-- Select Y-axis --</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">
              Select Chart Type:
            </label>
            <select
              className="border p-2 mb-4 w-full"
              value={block.chartType}
              onChange={(e) => updateBlock(index, "chartType", e.target.value)}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>

            {block.xColumn && block.yColumn && (
              <div className="mt-6">
                {block.chartType === "line" && (
                  <Line
                    ref={chartRefs.current[index]}
                    data={chartData}
                    options={chartOptions}
                  />
                )}
                {block.chartType === "bar" && (
                  <Bar
                    ref={chartRefs.current[index]}
                    data={chartData}
                    options={chartOptions}
                  />
                )}
                {block.chartType === "pie" && (
                  <Pie ref={chartRefs.current[index]} data={chartData} />
                )}

                <button
                  onClick={() => downloadPNG(index)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Download PNG
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addBlock}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto mb-4">
        <span className="text-xl mr-2">+</span> Add Graph
      </button>

      <button
        onClick={downloadPDF}
        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mx-auto">
        📄 Download Selected as PDF
      </button>
    </div>
  );
}
