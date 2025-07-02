import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        <p className="mb-6 text-gray-900 dark:text-gray-100">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            تایید
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanList() {
  const { year, month, day } = useParams();
  const navigate = useNavigate();

  const [foodPlan, setFoodPlan] = useState([]);
  const [exercisePlan, setExercisePlan] = useState([]);

  const localStorageFoodKey = `foodPlan_${year}_${month}_${day}`;
  const localStorageExerciseKey = `exercisePlan_${year}_${month}_${day}`;

  // حالت مودال تایید حذف
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});

  useEffect(() => {
    const savedFood = localStorage.getItem(localStorageFoodKey);
    if (savedFood) setFoodPlan(JSON.parse(savedFood));

    const savedExercise = localStorage.getItem(localStorageExerciseKey);
    if (savedExercise) setExercisePlan(JSON.parse(savedExercise));
  }, [localStorageFoodKey, localStorageExerciseKey]);

  // رفتن به صفحه افزودن یا ویرایش برنامه
  const goToAddEdit = () => {
    navigate(`/day/${year}/${month}/${day}`);
  };

  // ویرایش مورد (غذا یا تمرین)
  const goToEdit = (id) => {
    navigate(`/day/${year}/${month}/${day}?editId=${id}`);
  };

  // نمایش مودال برای حذف غذا
  const askDeleteFood = (id) => {
    setConfirmMessage("آیا مطمئن هستید که می‌خواهید این غذای برنامه را حذف کنید؟");
    setConfirmAction(() => () => {
      const updated = foodPlan.filter((f) => f.id !== id);
      setFoodPlan(updated);
      localStorage.setItem(localStorageFoodKey, JSON.stringify(updated));
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // نمایش مودال برای حذف تمرین
  const askDeleteExercise = (id) => {
    setConfirmMessage("آیا مطمئن هستید که می‌خواهید این تمرین برنامه را حذف کنید؟");
    setConfirmAction(() => () => {
      const updated = exercisePlan.filter((e) => e.id !== id);
      setExercisePlan(updated);
      localStorage.setItem(localStorageExerciseKey, JSON.stringify(updated));
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg font-vazir min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          برنامه روز {day}/{month}/{year}
        </h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={goToAddEdit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
            aria-label="افزودن یا ویرایش برنامه"
          >
            افزودن غذا یا تمرین
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
            aria-label="بازگشت به صفحه اصلی"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </header>

      {/* برنامه غذایی */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          برنامه غذایی
        </h3>
        {foodPlan.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">برنامه غذایی ثبت نشده است.</p>
        ) : (
          <ul className="space-y-3">
            {foodPlan.map((food) => (
              <li
                key={food.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded p-3 bg-gray-100 dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-grow">
                  <strong className="text-lg">{food.name}</strong>
                  <span>
                    مقدار: {food.quantity} {food.unitType === "weight" ? "گرم" : "عدد"}
                  </span>
                  <span>کالری هر واحد: {food.caloriesPerUnit}</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    کالری کل:{" "}
                    {food.unitType === "weight"
                      ? ((food.caloriesPerUnit * food.quantity) / 100).toFixed(0)
                      : (food.caloriesPerUnit * food.quantity).toFixed(0)}
                  </span>
                </div>
                <div className="flex gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => goToEdit(food.id)}
                    className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow transition"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => askDeleteFood(food.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow transition"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* برنامه تمرینی */}
      <section>
        <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
          برنامه تمرینی
        </h3>
        {exercisePlan.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">برنامه تمرینی ثبت نشده است.</p>
        ) : (
          <ul className="space-y-3">
            {exercisePlan.map((exercise) => (
              <li
                key={exercise.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded p-3 bg-gray-100 dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-grow">
                  <strong className="text-lg">{exercise.name}</strong>
                  <span>ست: {exercise.sets}</span>
                  <span>وزن: {exercise.weightKg} کیلوگرم</span>
                  <span>تکرار: {exercise.count}</span>
                </div>
                <div className="flex gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => goToEdit(exercise.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => askDeleteExercise(exercise.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow transition"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* مودال تایید حذف */}
      {confirmOpen && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}

export default PlanList;
