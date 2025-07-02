import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 left-4 p-2 bg-blue-600 text-white rounded shadow-md z-50
                 focus:outline-none hover:bg-blue-700 transition"
      aria-label="تغییر تم سایت"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
