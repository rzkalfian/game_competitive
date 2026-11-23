import { useEffect, useState } from "react";
export function Countdown({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const started = performance.now();
    const interval = window.setInterval(
      () =>
        setCount(
          Math.max(1, 3 - Math.floor((performance.now() - started) / 1000)),
        ),
      100,
    );
    const timer = window.setTimeout(onComplete, 3000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [onComplete]);
  return (
    <div className="countdown" role="status" aria-live="assertive">
      <span className="count-number">{count}</span>
    </div>
  );
}
