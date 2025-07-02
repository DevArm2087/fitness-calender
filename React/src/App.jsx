import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import SimpleCalendar from "./components/SimpleCalendar";
import DayDetails from "./components/DayDetails";
import PlanList from "./components/PlanList";
import ShareView from "./components/ShareView";

import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <div
      className={`min-h-screen flex flex-col
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <Router>
        <header
          className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b
            ${darkMode ? "border-gray-600" : "border-gray-300"}`}
        >
          <h1 className="text-2xl font-bold select-none mb-3 sm:mb-0 text-indigo-700">
            تقویم شمسی
          </h1>

          <div className="flex items-center space-x-0 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-end gap-2 flex-wrap">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1 rounded-md font-medium focus:outline-none
              ${
                darkMode
                  ? "bg-indigo-400 text-gray-900 hover:bg-indigo-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              } transition`}
              aria-label="تغییر تم"
            >
              {darkMode ? "حالت روشن" : "حالت تاریک"}
            </button>

            {!token && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-100 transition"
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
                >
                  ثبت‌نام
                </Link>
              </>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-400 text-white font-semibold transition"
              >
                خروج
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
          <Routes>
            <Route
              path="/login"
              element={token ? <Navigate to="/" replace /> : <Login onLogin={setToken} />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/" replace /> : <Register />}
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SimpleCalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/day/:year/:month/:day"
              element={
                <PrivateRoute>
                  <DayDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/plans/:year/:month/:day"
              element={
                <PrivateRoute>
                  <PlanList />
                </PrivateRoute>
              }
            />
            <Route path="/share" element={<ShareView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer
          className={`text-center p-4 text-sm
          ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
        >
          © 1404 تقویم شمسی | ساخته شده با ❤️ برای مادرم
        </footer>
      </Router>
    </div>
  );
}

export default App;
