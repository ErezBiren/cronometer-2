import { useState } from 'react';

interface Food {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AddEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    food: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => Promise<void>;
  selectedDate: string;
  onDateChange: (date: string) => void;
  foods: Food[];
  isLoading?: boolean;
}

export default function AddEntryForm({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  onDateChange,
  foods,
  isLoading = false,
}: AddEntryFormProps) {
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) {
      alert('Please select a food');
      return;
    }

    const food = foods.find(f => f.id === selectedFood);
    if (!food) return;

    const qty = parseInt(quantity) || 1;

    setSubmitting(true);
    try {
      await onSubmit({
        date: selectedDate,
        food: food.name,
        quantity: qty,
        calories: Math.round(food.calories * qty),
        protein: Math.round(food.protein * qty * 10) / 10,
        carbs: Math.round(food.carbs * qty * 10) / 10,
        fat: Math.round(food.fat * qty * 10) / 10,
      });
      setSelectedFood('');
      setQuantity('1');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🍎 Select Food</label>
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
            >
              <option value="">Choose a food...</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.serving}) - {food.calories} cal
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Quantity</label>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                disabled={submitting}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value || '1')}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-bold text-center text-2xl text-gray-900"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setQuantity((parseInt(quantity) + 1).toString())}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
                disabled={submitting}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? '⏳ Adding...' : '✨ Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
