export interface GameAudio {
  startGameplay(): void;
  pauseGameplay(): void;
  stopGameplay(): void;
  celebrateWinner(announcement: string): void;
  stopAll(): void;
}
