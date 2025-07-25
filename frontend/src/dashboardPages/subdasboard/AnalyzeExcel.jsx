import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import axios from "axios";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDownload,
  faSave,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

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

const buttonStyle =
  "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out";
const inputStyle =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
const labelStyle = "block text-sm font-medium text-gray-700";
const containerStyle = "container mx-auto mt-10 p-6 bg-white rounded shadow-md";
const blockContainerStyle =
  "bg-white rounded shadow p-4 mb-6 border border-gray-200";

export default function AnalyzeExcel() {
  const navigate = useNavigate();
  const location = useLocation();
  const excelData = location.state?.data || [];

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  const [blocks, setBlocks] = useState([
    {
      xColumn: "",
      yColumn: "",
      chartType: "line",
      enabled: true,
      name: "Graph #1",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const chartRefs = useRef([React.createRef()]);

  const addBlock = () => {
    const newIndex = blocks.length + 1;
    setBlocks([
      ...blocks,
      {
        xColumn: "",
        yColumn: "",
        chartType: "line",
        enabled: true,
        name: `Graph #${newIndex}`,
      },
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
      const safeName = blocks[index].name || `chart-${index + 1}`;
      link.href = base64;
      link.download = `${safeName}.png`;
      link.click();
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let yOffset = 10;

    blocks.forEach((block, idx) => {
      if (block.enabled && chartRefs.current[idx]?.current) {
        const base64 = chartRefs.current[idx].current.toBase64Image();
        pdf.text(block.name || `Graph #${idx + 1}`, 10, yOffset - 2);
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

  const handleSaveProject = async () => {
    const enabledCharts = blocks.filter((b) => b.enabled);

    const chartData = enabledCharts.map((block, index) => {
      const base64 = chartRefs.current[index]?.current?.toBase64Image() || "";
      return {
        name: block.name,
        chartType: block.chartType,
        xAxis: block.xColumn,
        yAxis: block.yColumn,
        imageBase64: base64,
      };
    });

    console.log(chartData);
    try {
      const response = await axios.post(
        "http://localhost:4000/analyze/projects",
        {
          projectName,
          projectDescription,
          charts: chartData,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Project saved:", response.data);
      alert("Project saved successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project");
    }
  };

  const chartTypeOptions = [
    { value: "line", label: "Line" },
    { value: "bar", label: "Bar" },
    { value: "pie", label: "Pie" },
  ];

  return (
    <div className={containerStyle}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={buttonStyle + " mb-4"}>
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Analyze Your Excel Data
      </h1>

      {/* Chart Blocks */}
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
              tension: 0.4,
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              align: "center",
              labels: {
                font: {
                  size: 14,
                },
                color: "#333",
              },
            },
            title: {
              display: true,
              text: block.name || `Graph #${index + 1}`,
              font: {
                size: 16,
              },
              color: "#555",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: block.xColumn,
                font: {
                  size: 14,
                },
                color: "#555",
              },
              ticks: {
                font: {
                  size: 12,
                },
                color: "#444",
              },
            },
            y: {
              title: {
                display: true,
                text: block.yColumn,
                font: {
                  size: 14,
                },
                color: "#555",
              },
              ticks: {
                font: {
                  size: 12,
                },
                color: "#444",
              },
            },
          },
        };

        return (
          <div key={index} className={blockContainerStyle}>
            {/* Graph Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`enabled-${index}`}
                  checked={block.enabled}
                  onChange={() => toggleEnabled(index)}
                  className="mr-2 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor={`enabled-${index}`}
                  className="text-lg font-medium text-gray-700">
                  {block.name || `Graph #${index + 1}`}
                </label>
              </div>
            </div>

            {/* Graph Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`name-${index}`} className={labelStyle}>
                  Graph Name:
                </label>
                <input
                  type="text"
                  id={`name-${index}`}
                  className={inputStyle}
                  value={block.name}
                  onChange={(e) => updateBlock(index, "name", e.target.value)}
                  placeholder={`Graph #${index + 1}`}
                />
              </div>

              <div>
                <label htmlFor={`xColumn-${index}`} className={labelStyle}>
                  Select X-axis:
                </label>
                <select
                  id={`xColumn-${index}`}
                  className={inputStyle}
                  value={block.xColumn}
                  onChange={(e) =>
                    updateBlock(index, "xColumn", e.target.value)
                  }>
                  <option value="">-- Select X-axis --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`yColumn-${index}`} className={labelStyle}>
                  Select Y-axis:
                </label>
                <select
                  id={`yColumn-${index}`}
                  className={inputStyle}
                  value={block.yColumn}
                  onChange={(e) =>
                    updateBlock(index, "yColumn", e.target.value)
                  }>
                  <option value="">-- Select Y-axis --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`chartType-${index}`} className={labelStyle}>
                  Select Chart Type:
                </label>
                <select
                  id={`chartType-${index}`}
                  className={inputStyle}
                  value={block.chartType}
                  onChange={(e) =>
                    updateBlock(index, "chartType", e.target.value)
                  }>
                  {chartTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chart Display */}
            {block.xColumn && block.yColumn && (
              <div className="mt-6">
                <div style={{ height: "300px", position: "relative" }}>
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
                    <Pie
                      ref={chartRefs.current[index]}
                      data={chartData}
                      options={chartOptions}
                    />
                  )}
                </div>

                <button
                  onClick={() => downloadPNG(index)}
                  className={buttonStyle + " mt-4"}>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download PNG
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Graph Button */}
      <button onClick={addBlock} className={buttonStyle + " mx-auto mb-6"}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Graph
      </button>

      {/* Project Actions */}
      <div className="flex justify-center space-x-4">
        <button onClick={downloadPDF} className={buttonStyle}>
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Download Selected as PDF
        </button>

        <button onClick={() => setShowModal(true)} className={buttonStyle}>
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Project
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Save Project
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <label htmlFor="projectName" className={labelStyle}>
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              className={inputStyle}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label htmlFor="projectDescription" className={labelStyle + " mt-4"}>
              Description:
            </label>
            <textarea
              id="projectDescription"
              className={inputStyle}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Cancel
              </button>
              <button onClick={handleSaveProject} className={buttonStyle}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
