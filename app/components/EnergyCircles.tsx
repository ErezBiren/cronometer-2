interface EnergyCirclesProps {
  consumed: number;
  expenditure: number;
}

function CircleIndicator({
  value,
  label,
  color,
  unit,
}: {
  value: number;
  label: string;
  color: string;
  unit: string;
}) {
  const circumference = 2 * Math.PI * 45;
  const percentage = Math.min(100, (value / 2500) * 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="mb-3">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#374151"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#f3f4f6"
        >
          {value}
        </text>
      </svg>
      <p className="font-semibold text-gray-300 text-center">{label}</p>
      <p className="text-sm text-gray-400">{unit}</p>
    </div>
  );
}

export default function EnergyCircles({ consumed, expenditure }: EnergyCirclesProps) {
  const remaining = Math.max(0, expenditure - consumed);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-8">💪 Energy Summary</h2>
      <div className="flex justify-around items-end">
        <CircleIndicator
          value={consumed}
          label="Consumed"
          color="#10b981"
          unit="kcal"
        />
        <CircleIndicator
          value={expenditure}
          label="Expenditure"
          color="#ec4899"
          unit="kcal"
        />
        <CircleIndicator
          value={remaining}
          label="Remaining"
          color="#f97316"
          unit="kcal"
        />
      </div>
    </div>
  );
}
