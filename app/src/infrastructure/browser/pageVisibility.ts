export function subscribeVisibility(callback: () => void) {
  const listener = () => {
    if (document.hidden) callback();
  };
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}
