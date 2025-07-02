import React, { useState } from "react";
import jalaali from "jalaali-js";
import { Link, useNavigate } from "react-router-dom";

const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function SimpleCalendar() {
  const [currentYear, setCurrentYear] = useState(() => {
    const today = new Date();
    const jDate = jalaali.toJalaali(today);
    return jDate.jy;
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    const jDate = jalaali.toJalaali(today);
    return jDate.jm;
  });

  const [isSharing, setIsSharing] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const navigate = useNavigate();

  const formatNumber = (num) => num.toString().padStart(2, "0");

  const firstDayGregorian = jalaali.toGregorian(currentYear, currentMonth, 1);
  const firstDayWeekday = new Date(
    firstDayGregorian.gy,
    firstDayGregorian.gm - 1,
    firstDayGregorian.gd
  ).getDay();
  const startDay = (firstDayWeekday + 6) % 7;

  let totalDays;
  if (currentMonth <= 6) {
    totalDays = 31;
  } else if (currentMonth <= 11) {
    totalDays = 30;
  } else {
    totalDays = jalaali.isLeapJalaaliYear(currentYear) ? 30 : 29;
  }

  const today = new Date();
  const todayJ = jalaali.toJalaali(today);

  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let d = 1; d <= totalDays; d++) daysArray.push(d);

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const toggleDaySelection = (day) => {
    const key = `${currentYear}-${formatNumber(currentMonth)}-${formatNumber(day)}`;
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleShare = () => {
    if (selectedDays.length === 0) {
      alert("لطفاً حداقل یک روز را انتخاب کنید.");
      return;
    }
    const query = new URLSearchParams({ days: selectedDays.join(",") });
    const url = `${window.location.origin}/share?${query}`;
    navigator.clipboard.writeText(url).then(() => {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
      }
      setCopySuccess(true);
      setIsSharing(false);
      setSelectedDays([]);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  return (
    <div
      className="max-w-md mx-auto p-4 rounded-xl shadow-lg font-vazir select-none
        bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 
        dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black"
      dir="rtl"
    >
      {/* دکمه‌های ماه */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={handleNextMonth}
            className="w-full sm:w-auto p-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition"
          >
            ماه بعد
          </button>
          <button
            onClick={handlePrevMonth}
            className="w-full sm:w-auto p-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition"
          >
            ماه قبل
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {currentYear} / {formatNumber(currentMonth)}
        </h2>

        <button
          onClick={() => {
            const now = new Date();
            const jNow = jalaali.toJalaali(now);
            setCurrentYear(jNow.jy);
            setCurrentMonth(jNow.jm);
          }}
          className="w-full sm:w-auto p-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
        >
          امروز
        </button>
      </div>

      {/* دکمه اشتراک‌گذاری */}
      <div className="mb-4 text-center">
        {!isSharing ? (
          <button
            onClick={() => setIsSharing(true)}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 font-medium transition"
          >
            انتخاب برای اشتراک‌گذاری
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleShare}
              disabled={selectedDays.length === 0}
              className={`px-4 py-2 rounded font-medium transition ${
                selectedDays.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              پایان انتخاب و دریافت لینک
            </button>
            <button
              onClick={() => {
                setIsSharing(false);
                setSelectedDays([]);
              }}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-400 transition"
            >
              لغو انتخاب
            </button>
          </div>
        )}
      </div>

      {/* پیام کپی موفق */}
      {copySuccess && (
        <div className="mb-4 text-center text-green-700 font-semibold">
          لینک کپی شد ✅
        </div>
      )}

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2 font-bold text-indigo-700 dark:text-indigo-400">
        {daysOfWeek.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>

      {/* خانه‌های تقویم */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysArray.map((day, i) => {
          if (day === null) return <div key={i} className="p-3"></div>;

          const dayKey = `${currentYear}-${formatNumber(currentMonth)}-${formatNumber(day)}`;
          const isToday =
            day === todayJ.jd &&
            currentMonth === todayJ.jm &&
            currentYear === todayJ.jy;

          const isSelected = selectedDays.includes(dayKey);

          return isSharing ? (
            <div
              key={i}
              onClick={() => toggleDaySelection(day)}
              className={`p-3 rounded cursor-pointer font-bold border transition 
                ${
                  isSelected
                    ? "bg-yellow-400 text-black border-yellow-600"
                    : "bg-white dark:bg-gray-700 hover:bg-yellow-200 dark:hover:bg-yellow-600"
                }`}
            >
              {day}
            </div>
          ) : (
            <Link
              key={i}
              to={`/day/${currentYear}/${currentMonth}/${day}`}
              className={`p-3 rounded cursor-pointer transition font-medium
                ${
                  isToday
                    ? "bg-purple-700 text-white font-extrabold shadow-lg"
                    : "bg-white dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-purple-600"
                }`}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SimpleCalendar;
