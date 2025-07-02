import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function pad2(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(year, month, day) {
  return `${pad2(day)}/${pad2(month)}/${year}`;
}

function ShareView() {
  const location = useLocation();

  const [plansByDay, setPlansByDay] = useState([]); // هر عنصر: { dateStr, foodPlan, exercisePlan }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const daysParam = searchParams.get("days"); // مثلا "1404-04-11,1404-04-12"
    if (!daysParam) {
      setPlansByDay([]);
      return;
    }

    const daysArray = daysParam.split(",");

    const loadedPlans = daysArray.map((dayStr) => {
      const [year, month, day] = dayStr.split("-");

      const foodKey = `foodPlan_${year}_${pad2(month)}_${pad2(day)}`;
      const exerciseKey = `exercisePlan_${year}_${pad2(month)}_${pad2(day)}`;

      let foodPlan = [];
      let exercisePlan = [];

      try {
        const savedFood = localStorage.getItem(foodKey);
        if (savedFood) foodPlan = JSON.parse(savedFood);
      } catch {}

      try {
        const savedExercise = localStorage.getItem(exerciseKey);
        if (savedExercise) exercisePlan = JSON.parse(savedExercise);
      } catch {}

      return {
        dateStr: formatDate(year, month, day),
        foodPlan,
        exercisePlan,
      };
    });

    setPlansByDay(loadedPlans);
  }, [location.search]);

  if (!plansByDay.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-gray-600 dark:text-gray-300">
        هیچ برنامه‌ای برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto p-6 space-y-8 font-vazir text-gray-900 dark:text-gray-200"
      dir="rtl"
    >
      {plansByDay.map(({ dateStr, foodPlan, exercisePlan }) => (
        <div
          key={dateStr}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4 border-b border-indigo-400 pb-2">
            برنامه روز {dateStr}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
              🥗 برنامه غذایی
            </h3>
            {foodPlan.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">هیچ برنامه غذایی ثبت نشده است.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {foodPlan.map((item) => (
                  <li key={item.id} className="hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded px-2 py-1 transition">
                    <span className="font-semibold">{item.name}</span> - مقدار:{" "}
                    {item.quantity} {item.unitType === "weight" ? "گرم" : "عدد"} - کالری کل:{" "}
                    {item.unitType === "weight"
                      ? ((item.caloriesPerUnit * item.quantity) / 100).toFixed(2)
                      : (item.caloriesPerUnit * item.quantity).toFixed(2)}{" "}
                    کالری
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
              💪 برنامه تمرینی
            </h3>
            {exercisePlan.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">هیچ برنامه تمرینی ثبت نشده است.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {exercisePlan.map((item) => (
                  <li key={item.id} className="hover:bg-green-100 dark:hover:bg-green-900 rounded px-2 py-1 transition">
                    <span className="font-semibold">{item.name}</span> - ست: {item.sets} - وزن: {item.weightKg} کیلوگرم - تکرار: {item.count}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShareView;
