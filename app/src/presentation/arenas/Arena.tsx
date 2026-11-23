import { Character } from "../components/Character";
import { PoleClimber } from "../components/PoleClimber";
import { TugCharacter } from "../components/TugCharacter";
import type { CSSProperties } from "react";
import { progressFor } from "../../domain/rules/gameRules";
import type { ArenaId, PlayerId } from "../../domain/entities/match";

export function Arena({
  type,
  scores = [2, 4],
  teamColors = ["#3B82F6", "#EF4444"],
  winner = null,
  demo = false,
  answerCounts = [0, 0],
  playing = false,
}: {
  type: ArenaId;
  scores?: [number, number];
  teamColors?: [string, string];
  winner?: PlayerId | null;
  demo?: boolean;
  answerCounts?: [number, number];
  playing?: boolean;
}) {
  const offset =
    winner !== null
      ? winner === 0
        ? -1
        : 1
      : Math.max(-1, Math.min(1, (scores[1] - scores[0]) / 8));
  if (type === "rope")
    return (
      <div
        className={`arena arena-rope ${demo ? "demo" : ""}`}
        aria-label="Arena tarik tambang"
        style={{ "--rope-offset": offset } as CSSProperties}
      >
        <svg
          viewBox={demo ? "0 0 600 180" : "0 0 180 600"}
          preserveAspectRatio={demo ? "xMidYMid meet" : "none"}
          aria-hidden="true"
        >
          <g transform={demo ? undefined : "translate(180 0) rotate(90)"}>
            <path d="M0 156q145-25 300 0t300 0" fill="#cbe5be" />
            <path
              d="M228 60v85"
              strokeWidth="5"
              strokeDasharray="7 5"
              stroke={teamColors[0]}
            />
            <path
              d="M372 60v85"
              strokeWidth="5"
              strokeDasharray="7 5"
              stroke={teamColors[1]}
            />
            <path
              d="M300 60v90"
              stroke="#657c67"
              strokeWidth="2"
              strokeDasharray="3 5"
            />
            <g
              className="rope-marker"
              style={{ transform: `translateX(${offset * 72}px)` }}
            >
              <g
                key={`${answerCounts[0]}-${answerCounts[1]}`}
                className={
                  playing && (answerCounts[0] > 0 || answerCounts[1] > 0)
                    ? "rope-pull"
                    : ""
                }
              >
                <path
                  d="M140 90H460"
                  fill="none"
                  stroke="#8A5E34"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M140 88H460"
                  fill="none"
                  stroke="#D9A978"
                  strokeWidth="3"
                  strokeDasharray="5 8"
                />
                <path
                  d="M140 87H460"
                  fill="none"
                  stroke="#B88655"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity=".55"
                />
                <path
                  d="M140 86H460"
                  fill="none"
                  stroke="#F0CBA3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 11"
                  opacity=".9"
                />
                <path
                  d="m290 74 20 0-4 43-7-8-8 8Z"
                  fill="#e75446"
                  stroke="#283c32"
                  strokeWidth="2"
                />
              </g>
            </g>
          </g>
        </svg>
        <div className="rope-person first">
          <TugCharacter
            key={answerCounts[0]}
            color={teamColors[0]}
            animate={playing && answerCounts[0] > 0}
          />
        </div>
        <div className="rope-person second">
          <TugCharacter
            key={answerCounts[1]}
            color={teamColors[1]}
            animate={playing && answerCounts[1] > 0}
          />
        </div>
        <span className="boundary-label first">P1</span>
        <span className="boundary-label second">P2</span>
      </div>
    );
  return (
    <div
      className={`arena arena-${type} ${demo ? "demo" : ""}`}
      aria-label={
        type === "sack" ? "Lintasan balap karung" : "Dua tiang panjat pinang"
      }
    >
      <div className="arena-top">
        {type === "sack" ? (
          "START"
        ) : (
          <svg viewBox="0 0 120 60" aria-hidden="true">
            <path
              d="M10 40q50-40 100 0"
              fill="none"
              stroke="#283c32"
              strokeWidth="4"
            />
            <path
              d="M35 25v25h-20V30Zm35-4v27H50V20Zm35 9v21H85V26Z"
              fill="#f9d665"
              stroke="#283c32"
              strokeWidth="3"
            />
            <path
              d="M23 30v18m37-27v25m35-18v20"
              stroke="#ef7565"
              strokeWidth="4"
            />
          </svg>
        )}
      </div>
      <div className="lanes">
        {scores.map((score, index) => (
          <div className="lane" key={index}>
            {type === "sack" ? (
              <div className="lane-dashes" />
            ) : (
              <div className="pole" />
            )}
            <div
              className="runner"
              style={{
                top: `calc(${(type === "sack" ? progressFor(score) : 1 - progressFor(score)) * 100}% - ${(type === "sack" ? progressFor(score) : 1 - progressFor(score)) * 65}px)`,
              }}
            >
              {type === "pole" ? (
                <PoleClimber
                  key={answerCounts[index]}
                  color={teamColors[index]}
                  animate={playing && answerCounts[index] > 0}
                />
              ) : (
                <Character
                  key={answerCounts[index]}
                  color={teamColors[index]}
                  sack={type === "sack"}
                  animate={playing && answerCounts[index] > 0}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="arena-bottom">
        {type === "sack" ? "FINISH" : <span className="grass" />}
      </div>
    </div>
  );
}
