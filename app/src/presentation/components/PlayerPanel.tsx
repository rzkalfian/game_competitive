import { Check, Flag, CircleCheck, CircleX } from "lucide-react";
import type { CSSProperties, Dispatch } from "react";
import type { Match, PlayerId } from "../../domain/entities/match";
import { colors } from "../../domain/entities/player";
import type { UIAction } from "../state/matchReducer";
import { ColorSelector } from "./ColorSelector";
import { AnswerRenderer } from "./AnswerRenderer";
import { Character } from "./Character";
export function PlayerPanel({
  match,
  playerId,
  dispatch,
}: {
  match: Match;
  playerId: PlayerId;
  dispatch: Dispatch<UIAction>;
}) {
  const player = match.players[playerId];
  const color = colors.find((item) => item.id === player.color);
  const lobby = match.phase === "ready" || match.phase === "paused";
  const question = match.questions[player.index];
  return (
    <section
      className={`player-panel player-${playerId} ${lobby ? "lobby-panel" : ""}`}
      aria-label={`Pemain ${playerId + 1}`}
      style={{ "--team": color?.hex ?? "#3B82F6" } as CSSProperties}
    >
      <div className="player-inner">
        <div className="player-heading">
          <span className="team-dot" />
          <strong>Pemain {playerId + 1}</strong>
          {lobby ? (
            <span className="player-meta">{color?.name ?? "Pilih warna"}</span>
          ) : (
            <>
              <span className="player-meta">
                {Math.min(player.index + 1, 20)} / 20
              </span>
              <strong className="score">
                {player.score}
                <small> / 8</small>
              </strong>
            </>
          )}
        </div>
        {lobby ? (
          <div className="lobby-body">
            <div className="lobby-character">
              <Character
                color={color?.hex ?? "#d4ded5"}
                sack={match.arena === "sack"}
              />
            </div>
            <div className="lobby-controls">
              {match.phase !== "paused" && (
                <ColorSelector
                  selected={player.color}
                  unavailable={match.players[(1 - playerId) as PlayerId].color}
                  disabled={playerId === 1 && !match.players[0].color}
                  onSelect={(next) =>
                    dispatch({ type: "color", player: playerId, color: next })
                  }
                />
              )}
              <button
                className="ready-button"
                disabled={
                  !match.players.every((item) => item.color) || player.ready
                }
                onClick={() => dispatch({ type: "ready", player: playerId })}
              >
                <Check size={20} />
                {player.ready
                  ? "Siap!"
                  : match.phase === "paused"
                    ? "Lanjut"
                    : "Siap"}
              </button>
            </div>
          </div>
        ) : question ? (
          <div className="question-body">
            <div className="question-copy">
              {player.feedback && (
                <span className={`feedback ${player.feedback}`} role="status">
                  {player.feedback === "correct" ? (
                    <CircleCheck size={15} />
                  ) : (
                    <CircleX size={15} />
                  )}{" "}
                  {player.feedback === "correct" ? "Benar +1" : "Salah -1"}
                </span>
              )}
              {question.image && (
                <img
                  className="question-image"
                  src={question.image}
                  alt={question.imageAlt}
                />
              )}
              <h2
                className={
                  question.answerType === "number" ? "math-question" : ""
                }
              >
                {question.prompt}
              </h2>
            </div>
            <AnswerRenderer
              key={`${match.id}-${question.id}`}
              question={question}
              disabled={match.phase !== "playing"}
              onAnswer={(answer) =>
                dispatch({
                  type: "answer",
                  player: playerId,
                  questionId: question.id,
                  answer,
                  matchId: match.id,
                })
              }
            />
          </div>
        ) : (
          <div className="bank-finished">
            <Flag size={28} />
            <strong>20 soal selesai</strong>
            <span>Menunggu lawan</span>
          </div>
        )}
      </div>
    </section>
  );
}
