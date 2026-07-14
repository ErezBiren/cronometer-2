'use client';

import { useState } from 'react';

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

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: Food) => Promise<void>;
}

export default function AddFoodModal({ isOpen, onClose, onAdd }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [grams, setGrams] = useState('100');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter food name');
      return;
    }

    setSubmitting(true);
    try {
      const newFood: Food = {
        id: Date.now().toString(),
        name: name.trim(),
        servings: [{ label: `${grams}g`, grams: parseInt(grams) || 100 }],
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
        calories: parseInt(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      };

      onAdd(newFood);
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setGrams('100');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🍎 Add Food</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Breast"
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Serving Size (g)</label>
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              min="1"
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition disabled:opacity-50 mt-6"
          >
            {submitting ? '⏳ Adding...' : '✨ Add Food'}
          </button>
        </form>
      </div>
    </div>
  );
}
