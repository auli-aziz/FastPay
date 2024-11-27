import React from 'react';

const Dashboard = () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    
    try {
      // Send a request to the /auth/logout endpoint
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies (if any) are sent with the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear session data and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response.statusText);
        alert('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-600 mb-2"><strong>Phone:</strong> {user.phone}</p>
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
