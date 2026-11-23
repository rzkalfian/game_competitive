import type { Player } from "./player";
import type { CategoryId, Question } from "./question";

export type ArenaId = "sack" | "pole" | "rope";
export type PlayerId = 0 | 1;
export interface Match {
  id: number;
  arena: ArenaId;
  category: CategoryId;
  phase: "ready" | "countdown" | "playing" | "paused" | "finished";
  questions: Question[];
  players: [Player, Player];
  winner: PlayerId | null;
}
