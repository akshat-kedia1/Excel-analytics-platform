import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  faArrowLeft,
  faTimes,
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
  "mt-1 block w-full h-8 px-2 py-1 rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
const labelStyle = "block text-sm font-medium text-gray-700";
const containerStyle = "container mx-auto mt-10 p-6 bg-white rounded";
const blockContainerStyle =
  "bg-white rounded shadow p-4 mb-6 border border-gray-200";

export default function ViewProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const chartRefs = useRef([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/analyze/projects/${projectId}`,
          {
            withCredentials: true,
          }
        );
        setProject(res.data.project);

        // Load saved charts into blocks
        const savedBlocks = res.data.project.charts.map((chart) => ({
          name: chart.name,
          chartType: chart.chartType,
          xColumn: chart.xAxis,
          yColumn: chart.yAxis,
          enabled: true,
          imageUrl: chart.imageUrl, // for fallback preview
        }));
        setBlocks(savedBlocks);

        chartRefs.current = savedBlocks.map(() => React.createRef());

        setProjectName(res.data.project.fileName || "");
        setProjectDescription(res.data.project.description || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
      }
    };

    fetchProject();
  }, [projectId]);

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
    } else if (blocks[index].imageUrl) {
      // fallback: download saved imageUrl from Cloudinary
      const link = document.createElement("a");
      link.href = blocks[index].imageUrl;
      link.download = `${blocks[index].name}.png`;
      link.click();
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let yOffset = 10;

    blocks.forEach((block, idx) => {
      if (block.enabled) {
        if (chartRefs.current[idx]?.current) {
          const base64 = chartRefs.current[idx].current.toBase64Image();
          pdf.text(block.name || `Graph #${idx + 1}`, 10, yOffset - 2);
          pdf.addImage(base64, "PNG", 10, yOffset, 180, 90);
        } else if (block.imageUrl) {
          // fallback for saved chart image
          pdf.text(block.name || `Graph #${idx + 1}`, 10, yOffset - 2);
          pdf.addImage(block.imageUrl, "PNG", 10, yOffset, 180, 90);
        }
        yOffset += 100;
        if (idx < blocks.length - 1) {
          pdf.addPage();
          yOffset = 10;
        }
      }
    });

    pdf.save(`${projectName || "project"}.pdf`);
  };

  const handleSaveProject = async () => {
    const enabledCharts = blocks.filter((b) => b.enabled);

    const chartData = await Promise.all(
      enabledCharts.map(async (block, index) => {
        let base64 = "";
        if (chartRefs.current[index]?.current) {
          base64 = chartRefs.current[index].current.toBase64Image();
        }
        return {
          name: block.name,
          chartType: block.chartType,
          xAxis: block.xColumn,
          yAxis: block.yColumn,
          imageBase64: base64,
        };
      })
    );

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

  const columns = project?.rows?.length > 0 ? Object.keys(project.rows[0]) : [];

  return (
    <div className={containerStyle + " h-[90vh] flex flex-col"}>
      <div className="sticky top-0 z-20 bg-white pb-2 mb-2 flex flex-col gap-2">
        <button
          onClick={() => navigate(-1)}
          className={buttonStyle + " mb-2 w-max"}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {projectName || "Project"}
        </h1>

        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <button onClick={downloadPDF} className={buttonStyle}>
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download Selected as PDF
          </button>
          <button onClick={() => setShowModal(true)} className={buttonStyle}>
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Project
          </button>
          <button onClick={addBlock} className={buttonStyle}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Graph
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2" style={{ minHeight: 0 }}>
        {blocks.map((block, index) => {
          const labels = project?.rows?.map((row) => row[block.xColumn]) || [];
          const values =
            project?.rows?.map((row) => Number(row[block.yColumn])) || [];

          const chartData = {
            labels,
            datasets: [
              {
                label: `${block.yColumn} vs ${block.xColumn}`,
                data: values,
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
                labels: {
                  font: { size: 14 },
                  color: "#333",
                },
              },
              title: {
                display: true,
                text: block.name || `Graph #${index + 1}`,
                font: { size: 16 },
                color: "#555",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: block.xColumn,
                  font: { size: 14 },
                  color: "#555",
                },
                ticks: {
                  font: { size: 12 },
                  color: "#444",
                },
              },
              y: {
                title: {
                  display: true,
                  text: block.yColumn,
                  font: { size: 14 },
                  color: "#555",
                },
                ticks: {
                  font: { size: 12 },
                  color: "#444",
                },
              },
            },
          };

          return (
            <div key={index} className={blockContainerStyle}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={block.enabled}
                    onChange={() => toggleEnabled(index)}
                    className="mr-2 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-lg font-medium text-gray-700">
                    {block.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Graph Name:</label>
                  <input
                    type="text"
                    className={inputStyle}
                    value={block.name}
                    onChange={(e) => updateBlock(index, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Select X-axis:</label>
                  <select
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
                  <label className={labelStyle}>Select Y-axis:</label>
                  <select
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
                  <label className={labelStyle}>Select Chart Type:</label>
                  <select
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
                      <Pie ref={chartRefs.current[index]} data={chartData} />
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
      </div>

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

            <label className={labelStyle}>Project Name:</label>
            <input
              type="text"
              className={inputStyle}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label className={labelStyle + " mt-4"}>Description:</label>
            <textarea
              className={inputStyle}
              style={{ minHeight: "100px", height: "140px" }}
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
