import { useEffect, useState } from "react";
import API from "../services/api.js";

function Jobs() {
  const role = localStorage.getItem("role");
  const [jobs, setJobs] = useState([]);

  // fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);

  // apply job
  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/applications",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Applied successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-black p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p className="text-green-400">₹ {job.salary}</p>

            {role === "student" && (
              <button
                onClick={() => applyJob(job._id)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
