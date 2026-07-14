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
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedServing, setSelectedServing] = useState<Serving | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSelectedServing(food.servings[0] || null);
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) {
      alert('Please select a food');
      return;
    }

    const qty = parseInt(quantity) || 1;

    setSubmitting(true);
    try {
      await onSubmit({
        date: selectedDate,
        food: selectedFood.name,
        quantity: qty,
        calories: Math.round(selectedFood.calories * qty),
        protein: Math.round(selectedFood.protein * qty * 10) / 10,
        carbs: Math.round(selectedFood.carbs * qty * 10) / 10,
        fat: Math.round(selectedFood.fat * qty * 10) / 10,
      });
      setSelectedFood(null);
      setQuantity('1');
      setSearchTerm('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900 mb-3"
            />

            <div className="border-2 border-blue-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Food</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFoods.map((food) => (
                    <tr
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className={`hover:bg-blue-50 cursor-pointer transition ${
                        selectedFood?.id === food.id ? 'bg-blue-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <img src={food.image} alt={food.name} className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{food.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedFood && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Serving Size</label>
              <select
                value={selectedServing?.label || ''}
                onChange={(e) => {
                  const serving = selectedFood.servings.find(s => s.label === e.target.value);
                  setSelectedServing(serving || null);
                }}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-gray-900"
              >
                {selectedFood.servings.map((serving) => (
                  <option key={serving.label} value={serving.label}>
                    {serving.label} ({serving.grams}g)
                  </option>
                ))}
              </select>
            </div>
          )}

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
              disabled={submitting || !selectedFood}
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
