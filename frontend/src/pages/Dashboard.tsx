import React from 'react';

const Dashboard = () => {
  // Simulating user data fetched from session or API
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-600 mb-2"><strong>Phone:</strong> {user.phone}</p>
        <button
          onClick={() => {
            localStorage.removeItem('sessionId'); // Logout functionality
            window.location.href = '/login';
          }}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
