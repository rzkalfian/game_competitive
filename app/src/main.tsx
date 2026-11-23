import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./presentation/styles/base.css";
import { GameApp } from "./presentation/screens/GameApp";
import { createGame } from "./bootstrap/createGame";
import { createPwaServices } from "./infrastructure/pwa/registerServiceWorker";

const services = createGame();
const pwa = createPwaServices();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameApp services={services} pwa={pwa} />
  </StrictMode>,
);
