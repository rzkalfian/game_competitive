import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Pause,
  Calculator,
  Shapes,
  Recycle,
  Sprout,
  Trophy,
  Home,
} from "lucide-react";
import type { GameServices } from "../../application/ports/gameServices";
import type { PwaServices } from "../../application/ports/pwaServices";
import type { ArenaId } from "../../domain/entities/match";
import { colors } from "../../domain/entities/player";
import { useMatch } from "../hooks/useMatch";
import { arenas, categories } from "../catalog";
import { Arena } from "../arenas/Arena";
import { PlayerPanel } from "../components/PlayerPanel";
import { Countdown } from "../components/Countdown";
import { Character } from "../components/Character";
import { PwaControls } from "../components/PwaControls";
import { RotationPrompt } from "../components/RotationPrompt";
import "../styles/game.css";

const categoryIcons = {
  math: Calculator,
  shapes: Shapes,
  waste: Recycle,
  plants: Sprout,
};

export function GameApp({
  services,
  pwa,
}: {
  services: GameServices;
  pwa: PwaServices;
}) {
  const [selectedArena, setSelectedArena] = useState<ArenaId | null>(null);
  const { match, dispatch, loading, error, prepare, restart, clear } =
    useMatch(services);
  const [resultMatchId, setResultMatchId] = useState<number | null>(null);
  const [rotationRequired, setRotationRequired] = useState(false);
  useEffect(
    () => services.subscribeRotationRequired(setRotationRequired),
    [services],
  );
  useEffect(() => {
    if (
      rotationRequired &&
      ["playing", "countdown"].includes(match?.phase ?? "")
    )
      dispatch({ type: "pause" });
  }, [rotationRequired, match?.phase, dispatch]);
  useEffect(() => () => services.releaseOrientation(), [services]);
  useEffect(() => {
    if (match?.phase !== "finished") return;
    const timer = window.setTimeout(() => setResultMatchId(match.id), 500);
    return () => window.clearTimeout(timer);
  }, [match?.phase, match?.id]);
  const home = () => {
    services.releaseOrientation();
    clear();
    setSelectedArena(null);
  };
  const teamColors = match?.players.map(
    (player) =>
      colors.find((color) => color.id === player.color)?.hex ?? "#c7d8cb",
  ) as [string, string] | undefined;
  const arena = arenas.find(
    (item) => item.id === (match?.arena ?? selectedArena),
  );
  const category = categories.find((item) => item.id === match?.category);
  const startPlaying = () => dispatch({ type: "start" });

  return (
    <div className={`app ${match ? "in-match" : ""}`}>
      <header className="app-header">
        {match || selectedArena ? (
          <button
            className="icon-button"
            title="Kembali ke menu"
            aria-label="Kembali ke menu"
            onClick={home}
          >
            <ArrowLeft size={22} />
          </button>
        ) : (
          <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M6 31 16 10 26 31Zm18 0 10-21 10 21Z"
              fill="#f9d665"
              stroke="#24463d"
              strokeWidth="3"
            />
            <path
              d="M5 39h38"
              stroke="#24463d"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        <div className="header-title">
          <strong>{match ? arena?.name : "Game Edukasi Berhadapan"}</strong>
          {match && <span>{category?.name}</span>}
        </div>
        {match ? (
          <button
            className="icon-button"
            title="Jeda pertandingan"
            aria-label="Jeda pertandingan"
            disabled={!["playing", "countdown"].includes(match.phase)}
            onClick={() => dispatch({ type: "pause" })}
          >
            <Pause size={20} />
          </button>
        ) : (
          <span className="local-label">2 pemain</span>
        )}
      </header>
      {!match && !selectedArena && (
        <main className="menu-screen">
          <div className="menu-heading">
            <span className="section-index">01 / ARENA</span>
            <h1>Pilih permainan</h1>
          </div>
          <div className="game-list">
            {arenas.map((item, index) => (
              <button
                className={`game-card game-${item.id}`}
                key={item.id}
                onClick={() => setSelectedArena(item.id)}
              >
                <div className="game-card-art">
                  <Arena type={item.id} demo />
                </div>
                <div className="game-card-caption">
                  <span className="game-number">0{index + 1}</span>
                  <div>
                    <h2>{item.name}</h2>
                    <span>{item.subtitle}</span>
                  </div>
                  <ArrowRight size={24} />
                </div>
              </button>
            ))}
          </div>
          <footer className="menu-footer">
            <span>Matematika</span>
            <span>Bangun ruang</span>
            <span>Jenis sampah</span>
            <span>Bagian tumbuhan</span>
          </footer>
          <PwaControls services={pwa} />
        </main>
      )}
      {!match && selectedArena && (
        <main className="category-screen">
          <div className="menu-heading">
            <span className="section-index">02 / MATERI</span>
            <h1>Pilih kategori</h1>
            <p>{arena?.name}</p>
          </div>
          <div className="category-list">
            {categories.map((item) => {
              const Icon = categoryIcons[item.id];
              return (
                <button
                  className={`category-button category-${item.id}`}
                  key={item.id}
                  disabled={loading}
                  onClick={() => {
                    void services.requestLandscape();
                    void prepare(selectedArena, item.id);
                  }}
                >
                  <span className="category-icon">
                    <Icon size={32} />
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.label}</small>
                  </span>
                  <ArrowRight size={22} />
                </button>
              );
            })}
          </div>
          <p className="round-details">
            20 soal <span>/</span> Target 8 poin
          </p>
        </main>
      )}
      {loading && (
        <div className="loading-strip" role="status">
          Menyiapkan soal...
        </div>
      )}
      {error && (
        <div className="error-panel" role="alert">
          <p>{error}</p>
          <button className="text-button" onClick={home}>
            <Home size={18} />
            Kembali ke menu
          </button>
        </div>
      )}
      {match && (match.phase !== "finished" || resultMatchId !== match.id) && (
        <main
          className={`match-layout side-layout phase-${match.phase}`}
          inert={rotationRequired}
        >
          <PlayerPanel match={match} playerId={0} dispatch={dispatch} />
          <Arena
            type={match.arena}
            scores={[match.players[0].score, match.players[1].score]}
            teamColors={teamColors}
            winner={match.winner}
            answerCounts={[match.players[0].index, match.players[1].index]}
            playing={match.phase === "playing" || match.phase === "finished"}
          />
          <PlayerPanel match={match} playerId={1} dispatch={dispatch} />
          {match.phase === "countdown" && !rotationRequired && (
            <Countdown onComplete={startPlaying} />
          )}
          {match.phase === "playing" && (
            <div className="start-flash" role="status">
              Mulai!
            </div>
          )}
        </main>
      )}
      {match && match.phase !== "finished" && rotationRequired && (
        <RotationPrompt
          onRotate={() => services.requestLandscape()}
          onBack={home}
        />
      )}
      {match?.phase === "finished" && resultMatchId === match.id && (
        <main className="result-screen">
          <div className="result-heading">
            <Trophy size={36} />
            <span className="section-index">HASIL PERTANDINGAN</span>
            <h1>
              {match.winner !== null
                ? `Pemain ${match.winner + 1} menang!`
                : "Tanpa pemenang"}
            </h1>
            <p>
              {arena?.name} / {category?.name}
            </p>
          </div>
          <div className="result-players">
            {match.players.map((player, index) => (
              <section
                className={`result-player ${match.winner === index ? "winner" : ""}`}
                key={index}
              >
                <Character
                  color={teamColors![index]}
                  sack={match.arena === "sack"}
                />
                <h2>Pemain {index + 1}</h2>
                <span>
                  {colors.find((color) => color.id === player.color)?.name}
                </span>
                <strong className="result-score">
                  {player.score}
                  <small> poin</small>
                </strong>
                <div className="result-stats">
                  <span>{player.correct} benar</span>
                  <span>{player.wrong} salah</span>
                </div>
              </section>
            ))}
          </div>
          <div className="result-actions">
            <button
              className="primary-button"
              disabled={loading}
              onClick={() => void restart()}
            >
              <RotateCcw size={20} />
              Main lagi
            </button>
            <button className="text-button" onClick={home}>
              <Home size={20} />
              Kembali ke menu
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
