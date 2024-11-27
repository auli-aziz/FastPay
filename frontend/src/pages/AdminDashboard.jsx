import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("http://localhost:3001/user/admin-dashboard", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const adminData = await response.json();
          console.log("Admin dashboard data:", adminData);
          setData(adminData);
        } else {
          throw new Error("Failed to fetch admin dashboard data.");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Admin Dashboard
        </h2>
        <div className="mb-4">
          <strong>Users:</strong>
          <pre className="bg-gray-200 p-4 rounded mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
