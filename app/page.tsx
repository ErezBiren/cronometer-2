'use client';

import { useEffect, useState } from 'react';

interface NutritionEntry {
  id: string;
  date: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DAILY_CALORIE_GOAL = 2000;

export default function Home() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/entries');
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal || !calories) {
      alert('Please fill in meal and calories');
      return;
    }

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          meal,
          calories: parseInt(calories),
          protein: parseInt(protein) || 0,
          carbs: parseInt(carbs) || 0,
          fat: parseInt(fat) || 0,
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries([...entries, newEntry]);
        setAnimatingId(newEntry.id);
        setTimeout(() => setAnimatingId(null), 600);
        setMeal('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/entries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setEntries(entries.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const getMotivation = (caloriesConsumed: number) => {
    const percentUsed = (caloriesConsumed / DAILY_CALORIE_GOAL) * 100;
    if (percentUsed < 50) return '🔥 Keep going! You\'re building momentum!';
    if (percentUsed < 75) return '💪 Great progress! Almost halfway there!';
    if (percentUsed < 100) return '🎯 You\'re crushing it! Stay on track!';
    if (percentUsed <= 110) return '✅ Perfect! Right on target!';
    return '⚠️ Watch your portions for the rest of the day!';
  };

  const todayEntries = entries.filter(e => e.date === selectedDate);
  const todayCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const todayProtein = todayEntries.reduce((sum, e) => sum + e.protein, 0);
  const todayCarbs = todayEntries.reduce((sum, e) => sum + e.carbs, 0);
  const todayFat = todayEntries.reduce((sum, e) => sum + e.fat, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        .animate-in { animation: slideIn 0.6s ease-out; }
        .animate-pop { animation: popIn 0.6s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-in">
          📊 Nutrition Diary
        </h1>
        <p className="text-gray-600 mb-8 text-lg">Track your macros like a boss 💪</p>

        {/* Add Entry Form */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 mb-8 border border-blue-100 animate-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Entry</h2>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🍽️ Meal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Breakfast, Lunch, Snack"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🔥 Calories</label>
                <input
                  type="number"
                  placeholder="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🥩 Protein</label>
                <input
                  type="number"
                  placeholder="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🥔 Carbs</label>
                <input
                  type="number"
                  placeholder="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🧈 Fat</label>
                <input
                  type="number"
                  placeholder="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white font-semibold"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ✨ Add Entry
            </button>
          </form>
        </div>

        {/* Daily Summary */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 mb-8 border border-blue-100 animate-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedDate === new Date().toISOString().split('T')[0] ? "Today's" : 'Daily'} Summary
          </h2>

          {/* Calorie Goal Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-lg font-bold text-gray-800">{todayCalories} / {DAILY_CALORIE_GOAL} kcal</p>
                <p className="text-sm text-gray-600">{DAILY_CALORIE_GOAL - todayCalories > 0 ? `${DAILY_CALORIE_GOAL - todayCalories} kcal remaining` : `${todayCalories - DAILY_CALORIE_GOAL} kcal over`}</p>
              </div>
              <span className={`text-3xl font-bold ${todayCalories <= DAILY_CALORIE_GOAL ? 'text-green-600' : 'text-orange-600'}`}>
                {Math.min(100, Math.round((todayCalories / DAILY_CALORIE_GOAL) * 100))}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  todayCalories <= DAILY_CALORIE_GOAL
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-orange-400 to-red-600'
                }`}
                style={{ width: `${Math.min(100, (todayCalories / DAILY_CALORIE_GOAL) * 100)}%` }}
              />
            </div>
            <p className="text-center mt-4 text-lg font-semibold text-gray-700">{getMotivation(todayCalories)}</p>
          </div>

          {/* Macro Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-4 text-white shadow-lg transform hover:scale-105 transition">
              <p className="text-sm font-medium opacity-90">Calories</p>
              <p className="text-3xl font-bold">{todayCalories}</p>
              <p className="text-xs opacity-75 mt-1">kcal</p>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-4 text-white shadow-lg transform hover:scale-105 transition">
              <p className="text-sm font-medium opacity-90">Protein</p>
              <p className="text-3xl font-bold">{todayProtein}</p>
              <p className="text-xs opacity-75 mt-1">g</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-4 text-white shadow-lg transform hover:scale-105 transition">
              <p className="text-sm font-medium opacity-90">Carbs</p>
              <p className="text-3xl font-bold">{todayCarbs}</p>
              <p className="text-xs opacity-75 mt-1">g</p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white shadow-lg transform hover:scale-105 transition">
              <p className="text-sm font-medium opacity-90">Fat</p>
              <p className="text-3xl font-bold">{todayFat}</p>
              <p className="text-xs opacity-75 mt-1">g</p>
            </div>
          </div>

          {/* Macro Ratio Visualization */}
          {todayCalories > 0 && (
            <div className="mt-8 pt-8 border-t border-blue-200">
              <p className="text-sm font-semibold text-gray-600 mb-3">Macro Distribution</p>
              <div className="flex h-8 rounded-full overflow-hidden shadow-md">
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{ width: `${(todayProtein * 4) / todayCalories * 100}%` }}
                  title={`Protein: ${Math.round((todayProtein * 4) / todayCalories * 100)}%`}
                />
                <div
                  className="bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(todayCarbs * 4) / todayCalories * 100}%` }}
                  title={`Carbs: ${Math.round((todayCarbs * 4) / todayCalories * 100)}%`}
                />
                <div
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${(todayFat * 9) / todayCalories * 100}%` }}
                  title={`Fat: ${Math.round((todayFat * 9) / todayCalories * 100)}%`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>🔴 P: {Math.round((todayProtein * 4) / todayCalories * 100)}%</span>
                <span>🟡 C: {Math.round((todayCarbs * 4) / todayCalories * 100)}%</span>
                <span>🟢 F: {Math.round((todayFat * 9) / todayCalories * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-xl p-8 border border-purple-100 animate-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Entries for {selectedDate}</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin">⏳</div>
            </div>
          ) : todayEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-gray-500 text-lg">No entries yet. Add your first meal above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-5 bg-gradient-to-r from-white to-purple-50 rounded-lg border border-purple-200 hover:shadow-lg hover:border-purple-400 transition-all duration-300 group ${
                    animatingId === entry.id ? 'animate-pop' : ''
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition">{entry.meal}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <div className="flex gap-4">
                        <span>🔥 {entry.calories} cal</span>
                        <span>🥩 {entry.protein}g protein</span>
                        <span>🥔 {entry.carbs}g carbs</span>
                        <span>🧈 {entry.fat}g fat</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
