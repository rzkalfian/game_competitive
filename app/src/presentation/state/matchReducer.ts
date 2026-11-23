import { transitionMatch } from "../../application/useCases/matchActions";
import type { MatchAction } from "../../application/useCases/matchActions";
import type { Match } from "../../domain/entities/match";

export type UIAction = MatchAction | { type: "replace"; match: Match | null };
export function matchReducer(
  match: Match | null,
  action: UIAction,
): Match | null {
  if (action.type === "replace") return action.match;
  return match ? transitionMatch(match, action) : null;
}
