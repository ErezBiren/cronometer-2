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
    </div>
  );
}
