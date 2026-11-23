import { describe, expect, it } from "vitest";
import { prepareMatch, restartMatch, transitionMatch } from "./matchActions";
import type { Match, PlayerId } from "../../domain/entities/match";
import type { Question } from "../../domain/entities/question";
import { progressFor, scoreDeltaForAnswer } from "../../domain/rules/gameRules";

const questions: Question[] = Array.from({ length: 20 }, (_, index) => ({
  id: `q${index}`,
  categoryId: "math",
  prompt: "1 + 1",
  answerType: "number",
  correctAnswer: "2",
  explanation: "Dua.",
}));
function playing(arena: Match["arena"] = "sack"): Match {
  let match = prepareMatch(arena, "math", questions, 1);
  match = transitionMatch(match, { type: "color", player: 0, color: "blue" });
  match = transitionMatch(match, { type: "color", player: 1, color: "red" });
  match = transitionMatch(match, { type: "ready", player: 0 });
  match = transitionMatch(match, { type: "ready", player: 1 });
  return transitionMatch(match, { type: "start" });
}
const answer = (match: Match, player: PlayerId, value = "2") =>
  transitionMatch(match, {
    type: "answer",
    player,
    answer: value,
    questionId: match.questions[match.players[player].index]?.id ?? "",
    matchId: match.id,
  });

describe("aturan pertandingan", () => {
  it("Balap Karung tidak mengurangi skor di bawah dasar", () => {
    const next = answer(playing(), 0, "3");
    expect(next.players[0].score).toBe(0);
    expect(progressFor(0)).toBe(0);
    expect(answer(next, 0, "3").players[0].score).toBe(0);
  });
  it("Panjat Pinang tidak mengurangi posisi ketika masih di dasar", () => {
    const match = playing("pole");
    expect(answer(match, 0, "3").players[0].score).toBe(0);
    expect(progressFor(0)).toBe(0);
  });
  it("Panjat Pinang turun satu langkah hanya setelah melewati dasar", () => {
    let match = playing("pole");
    match = answer(match, 0);
    match = answer(match, 0);
    expect(match.players[0].score).toBe(2);
    expect(answer(match, 0, "3").players[0].score).toBe(1);
  });
  it("menghitung pengurangan salah khusus arena", () => {
    expect(scoreDeltaForAnswer("pole", 0, false)).toBe(0);
    expect(scoreDeltaForAnswer("pole", -1, false)).toBe(0);
    expect(scoreDeltaForAnswer("pole", 1, false)).toBe(-1);
    expect(scoreDeltaForAnswer("sack", 0, false)).toBe(0);
    expect(scoreDeltaForAnswer("sack", 1, false)).toBe(-1);
  });
  it("menang setelah 8 benar tanpa salah dan mengabaikan input berikutnya", () => {
    let match = playing();
    for (let count = 0; count < 8; count++) match = answer(match, 0);
    expect(match.winner).toBe(0);
    expect(match.phase).toBe("finished");
    expect(answer(match, 1)).toBe(match);
  });
  it("kesalahan di atas dasar menunda kemenangan sampai skor kembali mencapai 8", () => {
    let match = playing();
    for (let count = 0; count < 7; count++) match = answer(match, 0);
    match = answer(match, 0, "3");
    expect(match.players[0].score).toBe(6);
    expect(match.winner).toBeNull();
    match = answer(match, 0);
    expect(match.players[0].score).toBe(7);
    expect(match.winner).toBeNull();
    expect(answer(match, 0).winner).toBe(0);
  });
  it("mengabaikan input kosong, ID soal lama, dan match lama", () => {
    const match = playing();
    expect(answer(match, 0, "")).toBe(match);
    const action = {
      type: "answer",
      player: 0,
      questionId: "q0",
      answer: "2",
      matchId: 1,
    } as const;
    const next = transitionMatch(match, action);
    expect(transitionMatch(next, action)).toBe(next);
    expect(transitionMatch(match, { ...action, matchId: 0 })).toBe(match);
  });
  it("menolak warna sama dan input sebelum countdown selesai", () => {
    const match = playing();
    const lobby = { ...match, phase: "ready" as const };
    expect(
      transitionMatch(lobby, { type: "color", player: 1, color: "blue" }),
    ).toBe(lobby);
    expect(answer(lobby, 0)).toBe(lobby);
  });
  it("membiarkan lawan lanjut setelah satu bank habis dan berakhir tanpa pemenang", () => {
    let match = playing();
    for (let count = 0; count < 20; count++) match = answer(match, 0, "3");
    expect(match.phase).toBe("playing");
    expect(answer(match, 0)).toBe(match);
    for (let count = 0; count < 20; count++) match = answer(match, 1, "3");
    expect(match.phase).toBe("finished");
    expect(match.winner).toBeNull();
  });
  it("jeda mempertahankan skor dan main lagi mereset state", () => {
    const match = answer(playing(), 0);
    const paused = transitionMatch(match, { type: "pause" });
    expect(paused.phase).toBe("paused");
    expect(paused.players[0].score).toBe(1);
    expect(paused.players.every((player) => !player.ready)).toBe(true);
    const reset = restartMatch(match, questions, 2);
    expect(reset.players[0].score).toBe(0);
    expect(reset.players[0].color).toBe("blue");
    expect(reset.phase).toBe("ready");
  });
  it("skor 7 menjadi 6 saat salah, bukan kemenangan", () => {
    let match = playing();
    for (let count = 0; count < 7; count++) match = answer(match, 0);
    const next = answer(match, 0, "3");
    expect(next.players[0].score).toBe(6);
    expect(next.winner).toBeNull();
  });
  it("dua jawaban kemenangan berurutan hanya menghasilkan satu pemenang", () => {
    let match = playing();
    for (let count = 0; count < 7; count++) {
      match = answer(match, 0);
      match = answer(match, 1);
    }
    const first = answer(match, 0);
    const second = answer(first, 1);
    expect(second).toBe(first);
    expect(second.winner).toBe(0);
    expect(second.players[1].score).toBe(7);
  });
  it("soal lawan tetap pada indeksnya sendiri", () => {
    const match = answer(playing(), 0);
    expect(match.players[0].index).toBe(1);
    expect(match.players[1].index).toBe(0);
    expect(match.questions[0].id).toBe("q0");
  });
  it("melanjutkan setelah jeda memerlukan kedua pemain siap dan countdown", () => {
    let match = transitionMatch(answer(playing(), 0), { type: "pause" });
    expect(answer(match, 0)).toBe(match);
    match = transitionMatch(match, { type: "ready", player: 0 });
    expect(match.phase).toBe("paused");
    match = transitionMatch(match, { type: "ready", player: 1 });
    expect(match.phase).toBe("countdown");
    match = transitionMatch(match, { type: "start" });
    expect(match.players[0].index).toBe(1);
    expect(match.players[0].score).toBe(1);
  });
});
