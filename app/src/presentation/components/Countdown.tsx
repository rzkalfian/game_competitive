import { useEffect, useRef, useState } from "react";
export function Countdown({
  onComplete,
  onTick,
}: {
  onComplete: () => void;
  onTick: () => void;
}) {
  const [count, setCount] = useState(3);
  const callbacks = useRef({ onComplete, onTick });
  useEffect(() => {
    callbacks.current = { onComplete, onTick };
  });
  useEffect(() => {
    const started = performance.now();
    callbacks.current.onTick();
    const interval = window.setInterval(
      () =>
        setCount(
          Math.max(1, 3 - Math.floor((performance.now() - started) / 1000)),
        ),
      100,
    );
    const ticks = [1000, 2000].map((delay) =>
      window.setTimeout(() => callbacks.current.onTick(), delay),
    );
    const timer = window.setTimeout(() => callbacks.current.onComplete(), 3000);
    return () => {
      window.clearInterval(interval);
      ticks.forEach(window.clearTimeout);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div className="countdown" role="status" aria-live="assertive">
      <span className="count-number">{count}</span>
    </div>
  );
}
