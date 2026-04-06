import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "student") {
      navigate("/applications");
    } else if (role === "recruiter") {
      navigate("/applicants");
    } else {
      navigate("/login");
    }
  }, [role]);

  return <div>Loading...</div>;
}

export default Dashboard;