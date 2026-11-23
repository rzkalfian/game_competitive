export interface GameAudio {
  startMenuMusic(): void;
  stopMenuMusic(): void;
  playCountdownTick(): void;
  playStart(): void;
  startGameplay(): void;
  pauseGameplay(): void;
  stopGameplay(): void;
  celebrateWinner(announcement: string): void;
  stopCelebration(): void;
  stopAll(): void;
}
