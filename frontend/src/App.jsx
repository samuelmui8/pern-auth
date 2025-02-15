import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = (value) => {
    if (!value) {
      localStorage.removeItem("token"); // Remove token on logout
    }
    setIsAuthenticated(value);
  };

  async function checkAuthenticated() {
    try {
      const response = await fetch("http://localhost:3000/auth/is-verified", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
        credentials: "include"
      });

      const data = await response.json();
      data === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Fragment>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route
              path="/register"
              element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
