import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:3001/user/user-info", {
          method: "GET",
          credentials: "include", // Send cookies with the request
        });

        if (response.ok) {
          const userData = await response.json();          
          setUser(userData);
        } else {
          throw new Error("Failed to fetch user information.");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      // Send a request to the /auth/logout endpoint
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear session data and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.statusText);
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Welcome, {user.name}!
        </h2>
        <p className="text-gray-600 mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Phone:</strong> {user.phone}
        </p>
        {user.role && user.role == "admin" && (
          <button
          onClick={() => navigate("/admin")}
          className="mt-4 mr-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Admin Dashboard
        </button>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
