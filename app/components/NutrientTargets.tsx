interface NutrientProgress {
  name: string;
  value: number;
  target: number;
}

interface GeneralItem {
  name: string;
  value: number;
  unit: string;
  target?: number;
  showDots?: boolean;
}

interface CarbItem {
  name: string;
  value: number;
  unit: string;
  target?: number;
  indent?: number;
  showDots?: boolean;
}

interface ProteinItem {
  name: string;
  value: number;
  unit: string;
  target?: number;
  indent?: number;
  showDots?: boolean;
}

interface NutrientTargetsProps {
  nutrients: NutrientProgress[];
  general?: GeneralItem[];
  carbohydrates?: CarbItem[];
  protein?: ProteinItem[];
}

function renderProgressBar(value: number, target: number | undefined, percent: number) {
  if (!target) return null;
  return (
    <div className="flex-1 flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 min-w-[40px] text-right">{percent}%</span>
    </div>
  );
}

function renderDotIndicator(value: number, maxDots: number = 14) {
  const dots = Math.ceil((value / 100) * maxDots);
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxDots }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < dots ? 'bg-gray-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function NutrientTargets({ nutrients, general = [], carbohydrates = [], protein = [] }: NutrientTargetsProps) {
  return (
    <div className="space-y-6">
      {/* Highlighted Nutrients */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">🥗 Highlighted Nutrients</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {nutrients.map((nutrient) => {
            const percent = Math.min(100, Math.round((nutrient.value / nutrient.target) * 100));
            const isOver = nutrient.value > nutrient.target;
            const circumference = 2 * Math.PI * 45;
            const strokeDashoffset = circumference - (percent / 100) * circumference;

            return (
              <div key={nutrient.name} className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke={isOver ? '#ef4444' : '#fbbf24'}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${isOver ? 'text-red-600' : 'text-amber-500'}`}>
                      {percent}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 text-center">{nutrient.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {nutrient.value.toFixed(1)} / {nutrient.target}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* General Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">General</h3>
        {general.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <table className="w-full">
            <tbody>
              {general.map((item) => {
                const percent = item.target ? Math.round((item.value / item.target) * 100) : 0;
                return (
                  <tr key={item.name} className="border-b border-gray-200 last:border-b-0">
                    <td className="text-sm font-semibold text-gray-700 py-4 pr-4">{item.name}</td>
                    <td className="text-sm font-semibold text-blue-600 py-4 pr-4 min-w-[100px]">
                      {item.value.toFixed(1)} {item.unit}
                    </td>
                    <td className="py-4">
                      {item.showDots ? (
                        renderDotIndicator(percent)
                      ) : item.target ? (
                        renderProgressBar(item.value, item.target, percent)
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">N/T</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Carbohydrates Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Carbohydrates</h3>
        {carbohydrates.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <table className="w-full">
            <tbody>
              {carbohydrates.map((item, idx) => {
                const percent = item.target ? Math.round((item.value / item.target) * 100) : 0;
                const indent = item.indent || 0;
                return (
                  <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                    <td
                      className="text-sm font-semibold text-gray-700 py-4 pr-4"
                      style={{ paddingLeft: `${16 + indent * 20}px` }}
                    >
                      {item.name}
                    </td>
                    <td className="text-sm font-semibold text-blue-600 py-4 pr-4 min-w-[100px]">
                      {item.value.toFixed(1)} {item.unit}
                    </td>
                    <td className="py-4">
                      {item.showDots ? (
                        renderDotIndicator(percent)
                      ) : item.target ? (
                        renderProgressBar(item.value, item.target, percent)
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">N/T</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Protein Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Protein</h3>
        {protein.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <table className="w-full">
            <tbody>
              {protein.map((item, idx) => {
                const percent = item.target ? Math.round((item.value / item.target) * 100) : 0;
                const indent = item.indent || 0;
                return (
                  <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                    <td
                      className="text-sm font-semibold text-gray-700 py-4 pr-4"
                      style={{ paddingLeft: `${16 + indent * 20}px` }}
                    >
                      {item.name}
                    </td>
                    <td className="text-sm font-semibold text-blue-600 py-4 pr-4 min-w-[100px]">
                      {item.value.toFixed(1)} {item.unit}
                    </td>
                    <td className="py-4">
                      {item.showDots ? (
                        renderDotIndicator(percent)
                      ) : item.target ? (
                        renderProgressBar(item.value, item.target, percent)
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">N/T</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
