import { NutritionEntry } from '@/app/lib/calculations';

interface EntriesTableProps {
  entries: NutritionEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: NutritionEntry) => void;
  loading: boolean;
  animatingId: string | null;
}

export default function EntriesTable({
  entries,
  onDelete,
  onEdit,
  loading,
  animatingId,
}: EntriesTableProps) {
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
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Food</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Calories</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
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
              <td className="px-6 py-4">
                <p className="font-semibold text-gray-900">{entry.food}</p>
              </td>
              <td className="px-6 py-4 text-gray-700">{entry.quantity}</td>
              <td className="px-6 py-4 text-gray-700">
                {entry.quantity === 1 ? 'serving' : 'servings'}
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{entry.calories} kcal</td>
              <td className="px-6 py-4 text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(entry)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded transition"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded transition"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
