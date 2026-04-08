interface ResultProps {
  digit: number;
  confidence: number;
  probabilities: number[];
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Result({ digit, confidence, probabilities }: ResultProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      {/* Big prediction */}
      <div className="flex flex-col items-center">
        <span className="text-8xl font-bold text-white">{digit}</span>
        <span className="text-neutral-400 text-sm mt-1">
          {(confidence * 100).toFixed(1)}% confidence
        </span>
      </div>

      {/* Probability bars */}
      <div className="w-full flex flex-col gap-1">
        {DIGITS.map((d) => {
          const prob = probabilities[d] ?? 0;
          const isTop = d === digit;
          return (
            <div key={d} className="flex items-center gap-2 text-xs">
              <span className={`w-4 text-right font-mono ${isTop ? "text-white font-bold" : "text-neutral-500"}`}>
                {d}
              </span>
              <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isTop ? "bg-white" : "bg-neutral-600"}`}
                  style={{ width: `${(prob * 100).toFixed(1)}%` }}
                />
              </div>
              <span className={`w-10 font-mono ${isTop ? "text-white" : "text-neutral-500"}`}>
                {(prob * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
