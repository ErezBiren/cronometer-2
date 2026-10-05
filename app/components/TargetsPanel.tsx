import { NutritionTargets } from '@/app/lib/calculations';

interface TargetsPanelProps {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: NutritionTargets;
  expenditure: number;
  weeklyProtein?: { consumed: number; target: number; diff: number };
}

function ProgressBar({
  current,
  target,
  label,
  unit,
  color,
}: {
  current: number;
  target: number;
  label: string;
  unit: string;
  color: string;
}) {
  const percentage = Math.min(100, (current / target) * 100);
  const isOver = current > target;

  return (
    <div className="mb-0">
      <div className="flex justify-between items-center mb-0">
        <p className="font-semibold text-gray-100 text-sm">{label}</p>
        <p className="text-xs font-bold text-gray-400">
          {Math.round(percentage)}%
        </p>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex justify-between mt-0">
        <p className="text-xs text-gray-400">
          {current.toFixed(1)} {unit}
        </p>
        <p className={`text-xs font-semibold ${isOver ? 'text-red-400' : 'text-gray-400'}`}>
          {target} {unit}
        </p>
      </div>
    </div>
  );
}

export default function TargetsPanel({
  consumed,
  targets,
  expenditure,
  weeklyProtein,
}: TargetsPanelProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">🎯 Targets</h2>
      <div className="space-y-2">
        <ProgressBar
          current={consumed.calories}
          target={expenditure}
          label="Energy"
          unit="kcal"
          color="#9ca3af"
        />
        <ProgressBar
          current={consumed.protein}
          target={targets.protein}
          label="Protein"
          unit="g"
          color="#10b981"
        />
        <ProgressBar
          current={consumed.carbs}
          target={targets.carbs}
          label="Net Carbs"
          unit="g"
          color="#9ca3af"
        />
        <ProgressBar
          current={consumed.fat}
          target={targets.fat}
          label="Fat"
          unit="g"
          color="#9ca3af"
        />
      </div>
      {weeklyProtein && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-100 text-sm">Protein · last 7 days</p>
            <p className={`text-sm font-bold ${weeklyProtein.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weeklyProtein.diff >= 0 ? '+' : ''}{weeklyProtein.diff.toFixed(1)} g
            </p>
          </div>
          <p className="text-xs text-gray-400">
            {weeklyProtein.consumed.toFixed(1)} g of {weeklyProtein.target} g target
          </p>
        </div>
      )}
    </div>
  );
}
