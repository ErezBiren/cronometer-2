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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm font-bold text-gray-600">
          {Math.round(percentage)}%
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-500">
          {current.toFixed(1)} {unit}
        </p>
        <p className={`text-xs font-semibold ${isOver ? 'text-red-600' : 'text-gray-500'}`}>
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
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Targets</h2>
      <div className="space-y-2">
        <ProgressBar
          current={consumed.calories}
          target={expenditure}
          label="Energy"
          unit="kcal"
          color="#f97316"
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
          color="#8b5cf6"
        />
        <ProgressBar
          current={consumed.fat}
          target={targets.fat}
          label="Fat"
          unit="g"
          color="#ec4899"
        />
      </div>
    </div>
  );
}
