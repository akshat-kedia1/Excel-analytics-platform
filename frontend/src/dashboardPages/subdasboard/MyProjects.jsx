import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:4000/analyze/projects", {
          withCredentials: true, // sends JWT cookie
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
        alert("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-6 bg-indigo-600 text-white p-4 rounded">
        📁 My Projects
      </h1>

      {projects.length === 0 ? (
        <p>No projects found yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link to={`${project._id}`}>
              <div key={project._id} className="p-4 border rounded shadow my-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{project.fileName}</h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // prevent <Link> from triggering
                      if (
                        confirm("Are you sure you want to delete this project?")
                      ) {
                        axios
                          .delete(
                            `http://localhost:4000/analyze/projects/${project._id}`,
                            {
                              withCredentials: true,
                            }
                          )
                          .then(() => {
                            setProjects((prev) =>
                              prev.filter((p) => p._id !== project._id)
                            );
                          })
                          .catch((err) => {
                            console.error(err);
                            alert("Failed to delete project");
                          });
                      }
                    }}
                    className="text-red-500 hover:text-red-700 ml-4"
                    title="Delete Project">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600">Charts: {project.charts.length}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.charts.map((chart, idx) => (
                    <img
                      key={idx}
                      src={chart.imageUrl}
                      alt={chart.name}
                      className="w-32 h-32 object-cover border"
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
