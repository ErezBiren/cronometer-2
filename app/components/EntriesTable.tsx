'use client';

import { useState } from 'react';
import { NutritionEntry } from '@/app/lib/calculations';

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

interface EntriesTableProps {
  entries: NutritionEntry[];
  foods: Food[];
  onDelete: (id: string) => void;
  onEdit: (entry: NutritionEntry) => void;
  onUpdateEntry: (id: string, quantity: number, serving: string) => Promise<void>;
  loading: boolean;
  animatingId: string | null;
}

export default function EntriesTable({
  entries,
  foods,
  onDelete,
  onEdit,
  onUpdateEntry,
  loading,
  animatingId,
}: EntriesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [editingServing, setEditingServing] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const startInlineEdit = (entry: NutritionEntry) => {
    setEditingId(entry.id);
    setEditingQuantity(entry.quantity.toString());
    setEditingServing(entry.serving);
  };

  const handleSaveInline = async (id: string) => {
    setSavingId(id);
    try {
      await onUpdateEntry(id, parseInt(editingQuantity) || 1, editingServing);
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  };

  const handleBlur = (id: string) => {
    handleSaveInline(id);
  };

  const getServingsForFood = (foodName: string): Serving[] => {
    const food = foods.find(f => f.name === foodName);
    return food?.servings || [];
  };

  const getImageForFood = (foodName: string): string | undefined => {
    const food = foods.find(f => f.name === foodName);
    return food?.image;
  };

  const totals = entries.reduce(
    (sum, e) => ({
      calories: sum.calories + e.calories,
      protein: sum.protein + e.protein,
      carbs: sum.carbs + e.carbs,
      fat: sum.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin text-3xl">⏳</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🍽️</p>
        <p className="text-gray-500 text-lg">No entries yet. Add your first meal above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-2 text-left text-sm font-semibold text-gray-700">Food</th>
            <th colSpan={4} className="px-6 py-2 text-left text-sm font-semibold text-gray-700">
              Total: {Math.round(totals.calories)} kcal &middot; {Math.round(totals.protein * 10) / 10}g protein &middot; {Math.round(totals.carbs * 10) / 10}g carbs &middot; {Math.round(totals.fat * 10) / 10}g fat
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry, idx) => (
            <tr
              key={entry.id}
              className={`hover:bg-gray-50 transition-colors ${
                animatingId === entry.id ? 'animate-pop' : ''
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <td className="px-6 py-2">
                <div className="flex items-center gap-3">
                  {getImageForFood(entry.food) && (
                    <img
                      src={getImageForFood(entry.food)}
                      alt={entry.food}
                      className="size-12 rounded-full object-cover"
                    />
                  )}
                  <p className="font-semibold text-gray-900">{entry.food}</p>
                </div>
              </td>
              <td className="px-6 py-2 text-center">
                {editingId === entry.id ? (
                  <input
                    type="number"
                    min="1"
                    value={editingQuantity}
                    onChange={(e) => setEditingQuantity(e.target.value)}
                    onBlur={() => handleBlur(entry.id)}
                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                    onFocus={(e) => e.target.select()}
                    className="w-16 px-2 py-1 border-2 border-blue-200 rounded text-center font-semibold text-gray-900"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => startInlineEdit(entry)}
                    className="cursor-pointer text-gray-700 hover:text-blue-600 font-semibold"
                  >
                    {entry.quantity}
                  </span>
                )}
              </td>
              <td className="px-6 py-2 text-left">
                {editingId === entry.id ? (
                  <select
                    value={editingServing}
                    onChange={(e) => setEditingServing(e.target.value)}
                    onBlur={() => handleBlur(entry.id)}
                    className="px-2 py-1 border-2 border-blue-200 rounded font-semibold text-gray-900"
                  >
                    {getServingsForFood(entry.food).map((serving) => (
                      <option key={serving.label} value={serving.label}>
                        {serving.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    onClick={() => startInlineEdit(entry)}
                    className="cursor-pointer text-gray-700 hover:text-blue-600 font-semibold"
                  >
                    {entry.serving}
                  </span>
                )}
              </td>
              <td className="px-6 py-2 text-right font-bold text-gray-900">{entry.calories} kcal</td>
              <td className="px-6 py-2 text-right">
                <button
                  onClick={() => onDelete(entry.id)}
                  disabled={savingId === entry.id}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded transition disabled:opacity-50"
                  title="Delete"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
