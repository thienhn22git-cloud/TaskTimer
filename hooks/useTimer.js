import { useState, useEffect, useRef } from 'react';

export default function useTimer(initialSeconds, onEnd) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);

  const reset = (newSeconds) => {
    setIsRunning(false);
    setSecondsLeft(newSeconds);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          onEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return { secondsLeft, isRunning, start, stop, reset };
}
