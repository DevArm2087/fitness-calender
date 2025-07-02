import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const foodOptions = [
  { id: 1, name: "نان", img: "🍞" },
  { id: 2, name: "سیب‌زمینی", img: "🥔" },
  { id: 3, name: "سیب", img: "🍎" },
  { id: 4, name: "ماست", img: "🥛" },
  { id: 5, name: "مرغ", img: "🍗" },
  { id: 6, name: "تخم‌مرغ", img: "🥚" },
  { id: 7, name: "ماکارونی" },
  { id: 8, name: "برنج" },
  { id: 9, name: "گوشت قرمز" },
  { id: 10, name: "لوبیا" },
  { id: 11, name: "عدس" },
  { id: 12, name: "مرغ سرخ‌کرده" },
  { id: 13, name: "تخم‌مرغ آب‌پز" },
  { id: 14, name: "تن ماهی" },
  { id: 15, name: "هویج" },
  { id: 16, name: "شیر" },
  { id: 17, name: "دوغ" },
  { id: 18, name: "کاهو" },
  { id: 19, name: "خیار" },
  { id: 20, name: "گوجه‌فرنگی" },
  { id: 21, name: "استیک گوشت" },
  { id: 22, name: "سوپ سبزیجات" },
  { id: 23, name: "مرغ آب‌پز" },
  { id: 24, name: "خوراک لوبیا" },
  { id: 25, name: "خوراک عدس" },
  { id: 26, name: "پلو مخلوط" }
];

const exerciseOptions = [
  { id: 1, name: "شنا" },
  { id: 2, name: "دراز نشست" },
  { id: 3, name: "بارفیکس" },
  { id: 4, name: "اسکات" },
  { id: 5, name: "پرس سینه با هالتر" },
  { id: 6, name: "پرس سرشانه با دمبل" },
  { id: 7, name: "جلو بازو با دمبل" },
  { id: 8, name: "پشت بازو سیم‌کش" },
  { id: 9, name: "ددلیفت با هالتر" },
  { id: 10, name: "لانچ با دمبل" },
  { id: 11, name: "اسکات دستگاه" },
  { id: 12, name: "زیر بغل قایقی" },
  { id: 13, name: "جلوبازو سیم‌کش" },
  { id: 14, name: "دوچرخه ثابت" },
  { id: 15, name: "دویدن روی تردمیل" },
  { id: 16, name: "پلانک" },
  { id: 17, name: "پرس پا دستگاه" },
  { id: 18, name: "پشت پا دستگاه" },
  { id: 19, name: "کرانچ شکم" },
  { id: 20, name: "بالا آوردن پا در حالت خوابیده" }
];

function DayDetails() {
  const { year, month, day } = useParams();
  const navigate = useNavigate();

  // تابع کمکی برای تبدیل به رشته 2 رقمی با صفر پرکن
  const pad2 = (num) => num.toString().padStart(2, "0");

  const [foodSearch, setFoodSearch] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");

  const [selectedFoodId, setSelectedFoodId] = useState(foodOptions[0].id);
  const [unitType, setUnitType] = useState("weight");
  const [quantity, setQuantity] = useState(100);
  const [caloriesPerUnit, setCaloriesPerUnit] = useState("");

  const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseOptions[0].id);
  const [exerciseSets, setExerciseSets] = useState("");
  const [exerciseWeight, setExerciseWeight] = useState("");
  const [exerciseCount, setExerciseCount] = useState("");

  const [foodPlan, setFoodPlan] = useState([]);
  const [exercisePlan, setExercisePlan] = useState([]);

  const [message, setMessage] = useState(null);

  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get("editId");

  // کلیدهای localStorage با فرمت دو رقمی ماه و روز
  const localStorageFoodKey = `foodPlan_${year}_${pad2(month)}_${pad2(day)}`;
  const localStorageExerciseKey = `exercisePlan_${year}_${pad2(month)}_${pad2(day)}`;

  useEffect(() => {
    const savedFood = localStorage.getItem(localStorageFoodKey);
    if (savedFood) setFoodPlan(JSON.parse(savedFood));

    const savedExercise = localStorage.getItem(localStorageExerciseKey);
    if (savedExercise) setExercisePlan(JSON.parse(savedExercise));
  }, [localStorageFoodKey, localStorageExerciseKey]);

  useEffect(() => {
    if (!editId) return;

    const foodItem = foodPlan.find(f => f.id.toString() === editId);
    if (foodItem) {
      setSelectedFoodId(foodItem.foodId);
      setUnitType(foodItem.unitType);
      setQuantity(foodItem.quantity);
      setCaloriesPerUnit(foodItem.caloriesPerUnit);
      setExerciseSets("");
      setExerciseWeight("");
      setExerciseCount("");
      return;
    }
    const exerciseItem = exercisePlan.find(e => e.id.toString() === editId);
    if (exerciseItem) {
      setSelectedExerciseId(exerciseItem.exerciseId);
      setExerciseSets(exerciseItem.sets);
      setExerciseWeight(exerciseItem.weightKg);
      setExerciseCount(exerciseItem.count || "");
      setSelectedFoodId(foodOptions[0].id);
      setUnitType("weight");
      setQuantity(100);
      setCaloriesPerUnit("");
    }
  }, [editId, foodPlan, exercisePlan]);

  const clearFormFood = () => {
    setSelectedFoodId(foodOptions[0].id);
    setUnitType("weight");
    setQuantity(100);
    setCaloriesPerUnit("");
  };

  const clearFormExercise = () => {
    setSelectedExerciseId(exerciseOptions[0].id);
    setExerciseSets("");
    setExerciseWeight("");
    setExerciseCount("");
  };

  const showSuccessMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // محاسبه کالری کل
  const totalCalories = () => {
    if (!caloriesPerUnit || !quantity) return 0;
    if (unitType === "weight") {
      return ((Number(caloriesPerUnit) * Number(quantity)) / 100).toFixed(2);
    } else {
      return (Number(caloriesPerUnit) * Number(quantity)).toFixed(2);
    }
  };

  const saveFood = () => {
    if (!caloriesPerUnit || isNaN(caloriesPerUnit) || caloriesPerUnit <= 0) {
      alert("لطفا کالری را به درستی وارد کنید");
      return;
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert("لطفا مقدار را به درستی وارد کنید");
      return;
    }

    const foodName = foodOptions.find(f => f.id === selectedFoodId).name;

    let updatedFoodPlan;
    if (editId && foodPlan.some(f => f.id.toString() === editId)) {
      updatedFoodPlan = foodPlan.map(f =>
        f.id.toString() === editId
          ? { ...f, foodId: selectedFoodId, name: foodName, quantity: Number(quantity), unitType, caloriesPerUnit: Number(caloriesPerUnit) }
          : f
      );
    } else {
      updatedFoodPlan = [
        ...foodPlan,
        {
          id: Date.now(),
          foodId: selectedFoodId,
          name: foodName,
          quantity: Number(quantity),
          unitType,
          caloriesPerUnit: Number(caloriesPerUnit),
        },
      ];
    }
    setFoodPlan(updatedFoodPlan);
    localStorage.setItem(localStorageFoodKey, JSON.stringify(updatedFoodPlan));

    clearFormFood();

    if (editId) {
      const url = new URL(window.location);
      url.searchParams.delete("editId");
      window.history.replaceState({}, "", url.toString());
    }

    showSuccessMessage("برنامه غذایی با موفقیت ثبت شد");
  };

  const saveExercise = () => {
    if (!exerciseSets || isNaN(exerciseSets) || exerciseSets <= 0) {
      alert("لطفا تعداد ست را به درستی وارد کنید");
      return;
    }
    if (!exerciseWeight || isNaN(exerciseWeight) || exerciseWeight < 0) {
      alert("لطفا وزن وزنه را به درستی وارد کنید (میتواند صفر باشد)");
      return;
    }
    if (!exerciseCount || isNaN(exerciseCount) || exerciseCount <= 0) {
      alert("لطفا تعداد تکرار را به درستی وارد کنید");
      return;
    }

    const exerciseName = exerciseOptions.find(e => e.id === selectedExerciseId).name;

    let updatedExercisePlan;
    if (editId && exercisePlan.some(e => e.id.toString() === editId)) {
      updatedExercisePlan = exercisePlan.map(e =>
        e.id.toString() === editId
          ? {
              ...e,
              exerciseId: selectedExerciseId,
              name: exerciseName,
              sets: Number(exerciseSets),
              weightKg: Number(exerciseWeight),
              count: Number(exerciseCount),
            }
          : e
      );
    } else {
      updatedExercisePlan = [
        ...exercisePlan,
        {
          id: Date.now(),
          exerciseId: selectedExerciseId,
          name: exerciseName,
          sets: Number(exerciseSets),
          weightKg: Number(exerciseWeight),
          count: Number(exerciseCount),
        },
      ];
    }
    setExercisePlan(updatedExercisePlan);
    localStorage.setItem(localStorageExerciseKey, JSON.stringify(updatedExercisePlan));

    clearFormExercise();

    if (editId) {
      const url = new URL(window.location);
      url.searchParams.delete("editId");
      window.history.replaceState({}, "", url.toString());
    }

    showSuccessMessage("برنامه تمرینی با موفقیت ثبت شد");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg font-vazir min-h-screen">
      <header className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          روز {pad2(day)}/{pad2(month)}/{year}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/plans/${year}/${pad2(month)}/${pad2(day)}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
            title="رفتن به صفحه برنامه‌ها"
          >
            برنامه‌ها
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
            title="بازگشت به صفحه اصلی"
          >
            صفحه اصلی
          </button>
        </div>
      </header>

      {message && (
        <div className="bg-green-200 text-green-800 p-2 mb-4 rounded text-center font-semibold">
          {message}
        </div>
      )}

      {/* فرم ثبت غذا */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
          {editId && foodPlan.some(f => f.id.toString() === editId)
            ? "ویرایش برنامه غذایی"
            : "افزودن برنامه غذایی"}
        </h3>

        <input
          type="text"
          value={foodSearch}
          onChange={(e) => setFoodSearch(e.target.value)}
          placeholder="جستجوی غذا..."
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(Number(e.target.value))}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {foodOptions
            .filter((f) => f.name.includes(foodSearch))
            .map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
        </select>

        <div className="flex gap-4 mb-4 justify-center">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              unitType === "weight"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
            onClick={() => {
              setUnitType("weight");
              setQuantity(100);
              setCaloriesPerUnit("");
            }}
          >
            وزنی (گرم)
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              unitType === "count"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
            onClick={() => {
              setUnitType("count");
              setQuantity(1);
              setCaloriesPerUnit("");
            }}
          >
            تعدادی
          </button>
        </div>

        <input
          type="number"
          min={unitType === "weight" ? 1 : 1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={unitType === "weight" ? "مقدار (گرم)" : "تعداد"}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <input
          type="number"
          min={0}
          value={caloriesPerUnit}
          onChange={(e) => setCaloriesPerUnit(e.target.value)}
          placeholder={
            unitType === "weight"
              ? "کالری هر 100 گرم (مثلاً 250)"
              : "کالری هر عدد (مثلاً 50)"
          }
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <input
          type="text"
          readOnly
          value={`کالری کل: ${totalCalories()}`}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-6 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold"
        />

        <button
          onClick={saveFood}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
        >
          {editId && foodPlan.some(f => f.id.toString() === editId) ? "ویرایش" : "افزودن"}
        </button>
      </section>

      {/* فرم ثبت تمرین */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
          {editId && exercisePlan.some(e => e.id.toString() === editId)
            ? "ویرایش برنامه تمرینی"
            : "افزودن برنامه تمرینی"}
        </h3>

        <input
          type="text"
          value={exerciseSearch}
          onChange={(e) => setExerciseSearch(e.target.value)}
          placeholder="جستجوی تمرین..."
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {exerciseOptions
            .filter((e) => e.name.includes(exerciseSearch))
            .map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          min={1}
          value={exerciseSets}
          onChange={(e) => setExerciseSets(e.target.value)}
          placeholder="تعداد ست"
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <input
          type="number"
          min={0}
          value={exerciseWeight}
          onChange={(e) => setExerciseWeight(e.target.value)}
          placeholder="وزن وزنه (کیلوگرم)"
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <input
          type="number"
          min={1}
          value={exerciseCount}
          onChange={(e) => setExerciseCount(e.target.value)}
          placeholder="تعداد تکرار"
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <button
          onClick={saveExercise}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
        >
          {editId && exercisePlan.some(e => e.id.toString() === editId) ? "ویرایش" : "افزودن"}
        </button>
      </section>
    </div>
  );
}

export default DayDetails;
