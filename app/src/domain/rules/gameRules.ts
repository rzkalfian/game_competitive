export const gameRules = {
  questionCount: 20,
  winningScore: 8,
  correctDelta: 1,
  wrongDelta: -1,
} as const;
export const progressFor = (score: number) =>
  Math.min(gameRules.winningScore, Math.max(0, score)) / gameRules.winningScore;

export const scoreDeltaForAnswer = (
  arena: "sack" | "pole" | "rope",
  score: number,
  correct: boolean,
) => {
  if (correct) return gameRules.correctDelta;
  if ((arena === "pole" || arena === "sack") && score <= 0) return 0;
  return gameRules.wrongDelta;
};
