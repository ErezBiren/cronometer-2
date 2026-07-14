'use client';

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

interface ManageFoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: Food[];
  onDelete: (id: string) => void;
}

export default function ManageFoodsModal({ isOpen, onClose, foods, onDelete }: ManageFoodsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🍎 Manage Foods</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No foods yet. Add your first food!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {foods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-600">
                      {food.servings[0]?.label} • {food.calories} cal • P:{food.protein}g • C:{food.carbs}g • F:{food.fat}g
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(food.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded transition"
                  title="Delete"
                >
                  ✕ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
