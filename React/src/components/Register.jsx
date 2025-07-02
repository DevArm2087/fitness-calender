import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", phone: "", password: "", password2: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید.");
        setFormData({ username: "", phone: "", password: "", password2: "" });
      } else {
        const data = await response.json();

        let errorMessages = [];
        for (const key in data) {
          if (Array.isArray(data[key])) {
            errorMessages.push(`${key}: ${data[key].join(" ، ")}`);
          } else {
            errorMessages.push(`${key}: ${data[key]}`);
          }
        }
        setMessage("خطا: " + errorMessages.join(" | "));
      }
    } catch {
      setMessage("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-xl
      bg-gradient-to-br from-indigo-50 to-purple-100
      dark:bg-gradient-to-br dark:from-gray-900 dark:to-indigo-900
      shadow-lg
      ">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-800 dark:text-indigo-300">
        ثبت‌نام
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="username"
          placeholder="نام کاربری"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-md
            border border-indigo-300
            focus:outline-none focus:ring-4 focus:ring-indigo-400
            bg-white text-gray-900 placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            transition"
        />
        <input
          name="phone"
          placeholder="شماره همراه (مثلاً 09123456789)"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-md
            border border-indigo-300
            focus:outline-none focus:ring-4 focus:ring-indigo-400
            bg-white text-gray-900 placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            transition"
        />
        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-md
            border border-indigo-300
            focus:outline-none focus:ring-4 focus:ring-indigo-400
            bg-white text-gray-900 placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            transition"
        />
        <input
          name="password2"
          type="password"
          placeholder="تکرار رمز عبور"
          value={formData.password2}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-md
            border border-indigo-300
            focus:outline-none focus:ring-4 focus:ring-indigo-400
            bg-white text-gray-900 placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            transition"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold text-lg shadow-md transition"
        >
          ثبت‌نام
        </button>
      </form>
      {message && (
        <p className="mt-6 text-center text-red-600 font-semibold whitespace-pre-line">
          {message}
        </p>
      )}
      <p className="mt-8 text-center text-indigo-700 dark:text-indigo-300">
        قبلاً حساب کاربری دارید؟{" "}
        <Link to="/login" className="font-semibold hover:underline">
          ورود
        </Link>
      </p>
    </div>
  );
}
