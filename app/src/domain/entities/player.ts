export const colors = [
  { id: "yellow", name: "Kuning", hex: "#EAB308" },
  { id: "blue", name: "Biru", hex: "#3B82F6" },
  { id: "red", name: "Merah", hex: "#EF4444" },
  { id: "green", name: "Hijau", hex: "#22C55E" },
  { id: "black", name: "Hitam", hex: "#000000" },
  { id: "white", name: "Putih", hex: "#FFFFFF" },
] as const;
export type ColorId = (typeof colors)[number]["id"];
export interface Player {
  color: ColorId | null;
  ready: boolean;
  score: number;
  index: number;
  correct: number;
  wrong: number;
  feedback: "correct" | "wrong" | null;
}
export const createPlayer = (color: ColorId | null = null): Player => ({
  color,
  ready: false,
  score: 0,
  index: 0,
  correct: 0,
  wrong: 0,
  feedback: null,
});
