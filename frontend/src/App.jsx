import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie"; // For handling cookies
import Login from "./pages/Login"; // Ensure proper imports
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

const App = () => {
  // Authentication check using cookies
  const isAuthenticated = () => {
    const sessionId = Cookies.get("SESSION_ID");
    return sessionId && sessionId !== "expired";
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public routes */}
        <Route path="/login" element={
            !isAuthenticated() ? (
              <Login />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route for the dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
