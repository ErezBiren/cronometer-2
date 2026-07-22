import { useState } from "react";

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

interface AddEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    foodId: string;
    serving: string;
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
  const [quantity, setQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSelectedServing(food.servings[0] || null);
    setSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) {
      alert("Please select a food");
      return;
    }

    const qty = parseInt(quantity) || 1;

    if (!selectedServing) {
      alert("Please select a serving size");
      return;
    }

    const servingRatio = selectedServing.grams / 100;

    setSubmitting(true);
    try {
      await onSubmit({
        date: selectedDate,
        foodId: selectedFood.id,
        serving: selectedServing.label,
        quantity: qty,
        calories: Math.round((selectedFood.calories ?? 0) * servingRatio * qty),
        protein:
          Math.round(selectedFood.protein * servingRatio * qty * 10) / 10,
        carbs: Math.round(selectedFood.carbs * servingRatio * qty * 10) / 10,
        fat: Math.round(selectedFood.fat * servingRatio * qty * 10) / 10,
      });
      setSelectedFood(null);
      setQuantity("1");
      setSearchTerm("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
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
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Food
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFoods.map((food) => (
                    <tr
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className={`hover:bg-blue-50 cursor-pointer transition ${
                        selectedFood?.id === food.id ? "bg-blue-100" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {food.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedFood && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value || "1")}
                  onFocus={(e) => e.target.select()}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-semibold text-center text-gray-900"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📏 Serving Size
                </label>
                <select
                  value={selectedServing?.label || ""}
                  onChange={(e) => {
                    const serving = selectedFood.servings.find(
                      (s) => s.label === e.target.value,
                    );
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
            </div>
          )}

          {selectedFood && selectedServing && (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">
                Protein:{" "}
                <span className="text-blue-600">
                  {Math.round(
                    selectedFood.protein *
                      (selectedServing.grams / 100) *
                      (parseInt(quantity) || 1) *
                      10,
                  ) / 10}
                  g
                </span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedFood}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50 mt-6"
          >
            {submitting ? "⏳ Adding..." : "✨ Add Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
