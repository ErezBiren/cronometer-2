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
  const [servings, setServings] = useState<Serving[]>([{ label: '100g', grams: 100 }]);
  const [submitting, setSubmitting] = useState(false);

  const addServing = () => {
    setServings([...servings, { label: '', grams: 0 }]);
  };

  const removeServing = (index: number) => {
    setServings(servings.filter((_, i) => i !== index));
  };

  const updateServing = (index: number, field: 'label' | 'grams', value: string) => {
    const updated = [...servings];
    if (field === 'grams') {
      updated[index].grams = parseInt(value) || 0;
    } else {
      updated[index].label = value;
    }
    setServings(updated);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter food name');
      return;
    }

    if (servings.length === 0 || servings.some(s => !s.label.trim() || s.grams <= 0)) {
      alert('Please add at least one serving with label and grams');
      return;
    }

    setSubmitting(true);
    try {
      const newFood: Food = {
        id: Date.now().toString(),
        name: name.trim(),
        servings: servings,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
        calories: parseInt(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      };

      await onAdd(newFood);
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setServings([{ label: '100g', grams: 100 }]);
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Serving Sizes</label>
            <div className="space-y-2 mb-2">
              {servings.map((serving, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={serving.label}
                    onChange={(e) => updateServing(index, 'label', e.target.value)}
                    placeholder="e.g., 100g, 1 cup"
                    className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                    disabled={submitting}
                  />
                  <input
                    type="number"
                    value={serving.grams}
                    onChange={(e) => updateServing(index, 'grams', e.target.value)}
                    placeholder="grams"
                    min="1"
                    className="w-24 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                    disabled={submitting}
                  />
                  {servings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServing(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addServing}
              className="w-full px-3 py-2 bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold rounded-lg transition"
              disabled={submitting}
            >
              + Add Serving Size
            </button>
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
