import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"

export function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const intervals = [
      { delay: 400, value: 20 },
      { delay: 700, value: 45 },
      { delay: 900, value: 70 },
      { delay: 1200, value: 90 },
    ];

    const timers = intervals.map(({ delay, value }) =>
      setTimeout(() => setProgress(value), delay)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [])

  return (
    <div className="w-64 space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="text-sm text-gray-500 text-center">{progress}%</div>
    </div>
  );
}