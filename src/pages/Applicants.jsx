import { useEffect, useState } from "react";
import API from "../services/api.js";

function Applicants() {
  const [applications, setApplications] = useState([]);

  const jobId = prompt("Enter Job ID"); // simple for now

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/applications/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-black p-4 rounded">
            <p>Name: {app.user.name}</p>
            <p>Email: {app.user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applicants;