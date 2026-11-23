import type { ArenaId, Match, PlayerId } from "../../domain/entities/match";
import { colors, createPlayer } from "../../domain/entities/player";
import type { ColorId } from "../../domain/entities/player";
import type { CategoryId, Question } from "../../domain/entities/question";
import { evaluateAnswer } from "../../domain/rules/evaluateAnswer";
import { gameRules, scoreDeltaForAnswer } from "../../domain/rules/gameRules";

export function prepareMatch(
  arena: ArenaId,
  category: CategoryId,
  questions: Question[],
  id: number,
): Match {
  if (
    questions.length !== gameRules.questionCount ||
    new Set(questions.map((question) => question.id)).size !==
      gameRules.questionCount
  ) {
    throw new Error("Bank harus berisi 20 soal berbeda.");
  }
  return {
    id,
    arena,
    category,
    questions,
    phase: "ready",
    players: [createPlayer(), createPlayer()],
    winner: null,
  };
}

export type MatchAction =
  | { type: "color"; player: PlayerId; color: ColorId }
  | { type: "ready"; player: PlayerId }
  | { type: "start" }
  | {
      type: "answer";
      player: PlayerId;
      questionId: string;
      answer: string;
      matchId: number;
    }
  | { type: "pause" };

export function transitionMatch(match: Match, action: MatchAction): Match {
  if (action.type === "pause") {
    if (!["playing", "countdown"].includes(match.phase)) return match;
    return {
      ...match,
      phase: "paused",
      players: match.players.map((player) => ({
        ...player,
        ready: false,
      })) as Match["players"],
    };
  }
  if (action.type === "start")
    return match.phase === "countdown" ? { ...match, phase: "playing" } : match;
  if (action.type === "color") {
    if (
      match.phase !== "ready" ||
      (action.player === 1 && !match.players[0].color) ||
      match.players[(1 - action.player) as PlayerId].color === action.color ||
      !colors.some((color) => color.id === action.color)
    )
      return match;
    const players = [...match.players] as Match["players"];
    players[action.player] = {
      ...players[action.player],
      color: action.color,
      ready: false,
    };
    return { ...match, players };
  }
  if (action.type === "ready") {
    if (
      !["ready", "paused"].includes(match.phase) ||
      !match.players.every((player) => player.color)
    )
      return match;
    const players = [...match.players] as Match["players"];
    players[action.player] = { ...players[action.player], ready: true };
    return {
      ...match,
      players,
      phase: players.every((player) => player.ready)
        ? "countdown"
        : match.phase,
    };
  }
  if (match.phase !== "playing" || action.matchId !== match.id) return match;
  const player = match.players[action.player];
  const question = match.questions[player.index];
  if (!question || question.id !== action.questionId) return match;
  const correct = evaluateAnswer(question, action.answer);
  if (correct === null) return match;
  const players = [...match.players] as Match["players"];
  players[action.player] = {
    ...player,
    score:
      player.score +
      scoreDeltaForAnswer(match.arena, player.score, correct),
    index: player.index + 1,
    correct: player.correct + Number(correct),
    wrong: player.wrong + Number(!correct),
    feedback: correct ? "correct" : "wrong",
  };
  const winner =
    players[action.player].score >= gameRules.winningScore
      ? action.player
      : null;
  const finished =
    winner !== null ||
    players.every((current) => current.index === match.questions.length);
  return {
    ...match,
    players,
    winner,
    phase: finished ? "finished" : "playing",
  };
}

export function restartMatch(
  match: Match,
  questions: Question[],
  id: number,
): Match {
  const next = prepareMatch(match.arena, match.category, questions, id);
  return {
    ...next,
    players: [
      createPlayer(match.players[0].color),
      createPlayer(match.players[1].color),
    ],
  };
}
