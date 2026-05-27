import { useEffect, useState } from "react";

export function useQuizTimer(guessedCount: number, totalCount: number, isGivenUp: boolean, resetCount: number) {
  const [seconds, setSeconds] = useState(0);
  const hasStarted = guessedCount > 0;
  const isFinished = hasStarted && guessedCount === totalCount;

  useEffect(() => {
    setSeconds(0);
  }, [resetCount]);

  useEffect(() => {
    if (!hasStarted || isFinished || isGivenUp) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [hasStarted, isFinished, isGivenUp]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const formattedTime =
    h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return { formattedTime, hasStarted, isFinished };
}
