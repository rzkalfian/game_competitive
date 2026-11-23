import type { ArenaId, Match } from "../../domain/entities/match";
import type { CategoryId } from "../../domain/entities/question";
import type { GameAudio } from "./gameAudio";

export interface GameServices {
  audio: GameAudio;
  prepare(arena: ArenaId, category: CategoryId): Promise<Match>;
  restart(match: Match): Promise<Match>;
  subscribeVisibility(callback: () => void): () => void;
  requestLandscape(): Promise<void>;
  releaseOrientation(): void;
  subscribeRotationRequired(callback: (required: boolean) => void): () => void;
}
