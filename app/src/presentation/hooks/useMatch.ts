import { useEffect, useReducer, useRef, useState } from "react";
import { matchReducer } from "../state/matchReducer";
import type { GameServices } from "../../application/ports/gameServices";
import type { ArenaId } from "../../domain/entities/match";
import type { CategoryId } from "../../domain/entities/question";

export function useMatch(services: GameServices) {
  const [match, dispatch] = useReducer(matchReducer, null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  useEffect(
    () => services.subscribeVisibility(() => dispatch({ type: "pause" })),
    [services],
  );
  async function prepare(arena: ArenaId, category: CategoryId) {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const next = await services.prepare(arena, category);
      if (activeRequest === requestId.current)
        dispatch({ type: "replace", match: next });
    } catch (cause) {
      if (activeRequest === requestId.current)
        setError(cause instanceof Error ? cause.message : "Soal gagal dimuat.");
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }
  async function restart() {
    if (!match) return;
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const next = await services.restart(match);
      if (activeRequest === requestId.current)
        dispatch({ type: "replace", match: next });
    } catch (cause) {
      if (activeRequest === requestId.current)
        setError(cause instanceof Error ? cause.message : "Soal gagal dimuat.");
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }
  function clear() {
    requestId.current++;
    dispatch({ type: "replace", match: null });
    setError("");
    setLoading(false);
  }
  return { match, dispatch, loading, error, prepare, restart, clear };
}
