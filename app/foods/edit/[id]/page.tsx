'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Serving {
  label: string;
  grams: number;
}

interface Food {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories?: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionFacts {
  calories: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  totalCarbs: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  protein: string;
  vitaminD: string;
  calcium: string;
  iron: string;
  potassium: string;
}

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams();
  const foodId = params.id as string;

  const [name, setName] = useState('');
  const [nutrition, setNutrition] = useState<NutritionFacts>({
    calories: '',
    totalFat: '',
    saturatedFat: '',
    transFat: '',
    cholesterol: '',
    sodium: '',
    totalCarbs: '',
    dietaryFiber: '',
    totalSugars: '',
    addedSugars: '',
    protein: '',
    vitaminD: '',
    calcium: '',
    iron: '',
    potassium: '',
  });
  const [servings, setServings] = useState<Serving[]>([{ label: '100g', grams: 100 }]);
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFood = async () => {
      try {
        const res = await fetch('/api/foods');
        const foods = await res.json();
        const food = foods.find((f: Food) => f.id === foodId);

        if (food) {
          setName(food.name);
          setServings(food.servings);
          setImage(food.image);
          setNutrition({
            calories: (food.calories ?? 0).toString(),
            totalFat: food.fat.toString(),
            saturatedFat: '',
            transFat: '',
            cholesterol: '',
            sodium: '',
            totalCarbs: food.carbs.toString(),
            dietaryFiber: '',
            totalSugars: '',
            addedSugars: '',
            protein: food.protein.toString(),
            vitaminD: '',
            calcium: '',
            iron: '',
            potassium: '',
          });
        }
      } catch (error) {
        console.error('Failed to load food:', error);
      } finally {
        setLoading(false);
      }
    };

    if (foodId) {
      loadFood();
    }
  }, [foodId]);

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

  const updateNutrition = (key: keyof NutritionFacts, value: string) => {
    setNutrition(prev => ({ ...prev, [key]: value }));
  };

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
      const updatedFood: Food = {
        id: foodId,
        name: name.trim(),
        servings: servings,
        image,
        calories: parseInt(nutrition.calories) || 0,
        protein: parseFloat(nutrition.protein) || 0,
        carbs: parseFloat(nutrition.totalCarbs) || 0,
        fat: parseFloat(nutrition.totalFat) || 0,
      };

      const res = await fetch('/api/foods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFood),
      });

      if (res.ok) {
        router.push('/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-bold text-lg mb-4"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🍎 Edit Food
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chicken Breast"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Serving Sizes</label>
              <div className="space-y-3 mb-4">
                {servings.map((serving, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={serving.label}
                      onChange={(e) => updateServing(index, 'label', e.target.value)}
                      placeholder="e.g., 100g, 1 cup"
                      className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                    <input
                      type="number"
                      value={serving.grams}
                      onChange={(e) => updateServing(index, 'grams', e.target.value)}
                      placeholder="grams"
                      min="1"
                      className="w-32 px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                    {servings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServing(index)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-bold"
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
                className="w-full px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold rounded-lg transition"
                disabled={submitting}
              >
                + Add Serving Size
              </button>
            </div>

            <div className="mt-8 border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Calories</label>
                    <input
                      type="number"
                      value={nutrition.calories}
                      onChange={(e) => updateNutrition('calories', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Fat (g)</label>
                    <input
                      type="number"
                      value={nutrition.totalFat}
                      onChange={(e) => updateNutrition('totalFat', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-4 text-sm">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Saturated Fat (g)</label>
                    <input
                      type="number"
                      value={nutrition.saturatedFat}
                      onChange={(e) => updateNutrition('saturatedFat', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Trans Fat (g)</label>
                    <input
                      type="number"
                      value={nutrition.transFat}
                      onChange={(e) => updateNutrition('transFat', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cholesterol (mg)</label>
                    <input
                      type="number"
                      value={nutrition.cholesterol}
                      onChange={(e) => updateNutrition('cholesterol', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sodium (mg)</label>
                    <input
                      type="number"
                      value={nutrition.sodium}
                      onChange={(e) => updateNutrition('sodium', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Carbs (g)</label>
                    <input
                      type="number"
                      value={nutrition.totalCarbs}
                      onChange={(e) => updateNutrition('totalCarbs', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-4 text-sm">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Dietary Fiber (g)</label>
                    <input
                      type="number"
                      value={nutrition.dietaryFiber}
                      onChange={(e) => updateNutrition('dietaryFiber', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Sugars (g)</label>
                    <input
                      type="number"
                      value={nutrition.totalSugars}
                      onChange={(e) => updateNutrition('totalSugars', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-8 text-sm">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Added Sugars (g)</label>
                    <input
                      type="number"
                      value={nutrition.addedSugars}
                      onChange={(e) => updateNutrition('addedSugars', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={nutrition.protein}
                      onChange={(e) => updateNutrition('protein', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Vitamin D (mcg)</label>
                      <input
                        type="number"
                        value={nutrition.vitaminD}
                        onChange={(e) => updateNutrition('vitaminD', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Calcium (mg)</label>
                      <input
                        type="number"
                        value={nutrition.calcium}
                        onChange={(e) => updateNutrition('calcium', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Iron (mg)</label>
                      <input
                        type="number"
                        value={nutrition.iron}
                        onChange={(e) => updateNutrition('iron', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Potassium (mg)</label>
                      <input
                        type="number"
                        value={nutrition.potassium}
                        onChange={(e) => updateNutrition('potassium', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                {submitting ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
