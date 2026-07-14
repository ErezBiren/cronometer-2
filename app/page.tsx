'use client';

import { useEffect, useState } from 'react';
import EntriesTable from '@/app/components/EntriesTable';
import EnergyCircles from '@/app/components/EnergyCircles';
import TargetsPanel from '@/app/components/TargetsPanel';
import NutrientTargets from '@/app/components/NutrientTargets';
import AddEntryForm from '@/app/components/AddEntryForm';
import AddFoodModal from '@/app/components/AddFoodModal';
import ManageFoodsModal from '@/app/components/ManageFoodsModal';
import { calculateDailyTotals, getStoredTargets, setStoredTargets, DAILY_EXPENDITURE } from '@/app/lib/calculations';
import type { NutritionEntry, NutritionTargets } from '@/app/lib/calculations';
import foodsData from '@/data/foods.json';

interface Serving {
  label: string;
  grams: number;
}

interface Food {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FOOD_DATABASE: Food[] = foodsData;

export default function Home() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [foods, setFoods] = useState<Food[]>(FOOD_DATABASE);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isManageFoodsOpen, setIsManageFoodsOpen] = useState(false);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCalories, setEditCalories] = useState('');
  const [editProtein, setEditProtein] = useState('');
  const [editCarbs, setEditCarbs] = useState('');
  const [editFat, setEditFat] = useState('');

  useEffect(() => {
    fetchEntries();
    setTargets(getStoredTargets());
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

  const handleAddEntry = async (data: {
    date: string;
    food: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries([...entries, newEntry]);
        setAnimatingId(newEntry.id);
        setTimeout(() => setAnimatingId(null), 600);
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

  const startEdit = (entry: NutritionEntry) => {
    setEditingId(entry.id);
    setEditCalories(entry.calories.toString());
    setEditProtein(entry.protein.toString());
    setEditCarbs(entry.carbs.toString());
    setEditFat(entry.fat.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const res = await fetch('/api/entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          calories: parseInt(editCalories) || 0,
          protein: parseFloat(editProtein) || 0,
          carbs: parseFloat(editCarbs) || 0,
          fat: parseFloat(editFat) || 0,
        }),
      });

      if (res.ok) {
        const updatedEntry = await res.json();
        setEntries(entries.map(e => e.id === editingId ? updatedEntry : e));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleUpdateEntry = async (id: string, quantity: number, serving: string) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) return;

      const food = foods.find(f => f.name === entry.food);
      if (!food) return;

      const selectedServing = food.servings.find(s => s.label === serving);
      if (!selectedServing) return;

      const servingRatio = selectedServing.grams / 100;

      const res = await fetch('/api/entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          quantity,
          serving,
          calories: Math.round(food.calories * servingRatio * quantity),
          protein: Math.round(food.protein * servingRatio * quantity * 10) / 10,
          carbs: Math.round(food.carbs * servingRatio * quantity * 10) / 10,
          fat: Math.round(food.fat * servingRatio * quantity * 10) / 10,
        }),
      });

      if (res.ok) {
        const updatedEntry = await res.json();
        setEntries(entries.map(e => e.id === id ? updatedEntry : e));
      }
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleAddFood = async (newFood: Food) => {
    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFood),
      });

      if (res.ok) {
        const savedFood = await res.json();
        setFoods([...foods, savedFood]);
      }
    } catch (error) {
      console.error('Failed to add food:', error);
    }
  };

  const handleDeleteFood = async (id: string) => {
    try {
      const res = await fetch('/api/foods', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setFoods(foods.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete food:', error);
    }
  };

  const todayEntries = entries.filter(e => e.date === selectedDate);
  const totals = calculateDailyTotals(entries, selectedDate);

  if (!targets) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: popIn 0.6s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 Nutrition Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-2">Track your macros like a boss 💪</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-3">
              <button
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="text-blue-600 hover:text-blue-700 font-bold text-xl"
                title="Previous day"
              >
                ◄
              </button>
              <span className="text-lg font-semibold text-gray-800 min-w-[100px] text-center">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="text-blue-600 hover:text-blue-700 font-bold text-xl"
                title="Next day"
              >
                ►
              </button>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="text-gray-600 hover:text-gray-700 font-bold text-lg ml-2"
                title="Open calendar"
              >
                ▼
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="hidden"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsManageFoodsOpen(true)}
                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                ⚙️
              </button>
              <button
                onClick={() => setIsAddFoodOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                🍎 Add Food
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                ➕ Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="mb-8">
          <EntriesTable
            entries={todayEntries}
            foods={FOOD_DATABASE}
            onDelete={handleDelete}
            onEdit={startEdit}
            onUpdateEntry={handleUpdateEntry}
            loading={loading}
            animatingId={animatingId}
          />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnergyCircles consumed={totals.calories} expenditure={DAILY_EXPENDITURE} />
          </div>
          <div>
            <TargetsPanel
              consumed={totals}
              targets={targets}
              expenditure={DAILY_EXPENDITURE}
            />
          </div>
        </div>

        {/* Nutrient Targets */}
        <div className="mt-8">
          <NutrientTargets
            nutrients={[
              { name: 'Fiber', value: 0, target: 25 },
              { name: 'Iron', value: 0, target: 18 },
              { name: 'Calcium', value: 0, target: 1000 },
              { name: 'Vit. A', value: 0, target: 900 },
              { name: 'Vit. C', value: 0, target: 90 },
              { name: 'Vit. B12', value: 0, target: 2.4 },
              { name: 'Folate', value: 0, target: 400 },
              { name: 'Potassium', value: 0, target: 3500 },
            ]}
          />
        </div>
      </div>

      {/* Add Entry Modal */}
      <AddEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddEntry}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        foods={foods}
      />

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onAdd={handleAddFood}
      />

      {/* Manage Foods Modal */}
      <ManageFoodsModal
        isOpen={isManageFoodsOpen}
        onClose={() => setIsManageFoodsOpen(false)}
        foods={foods}
        onDelete={handleDeleteFood}
      />

      {/* Edit Modal - kept for backward compatibility */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={editCalories}
                  onChange={(e) => setEditCalories(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={editProtein}
                  onChange={(e) => setEditProtein(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={editCarbs}
                  onChange={(e) => setEditCarbs(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  value={editFat}
                  onChange={(e) => setEditFat(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setIsCalendarOpen(false);
              }}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
