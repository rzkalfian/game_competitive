import { registerSW } from "virtual:pwa-register";
import type {
  PwaServices,
  PwaState,
} from "../../application/ports/pwaServices";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
export function createPwaServices(): PwaServices {
  let prompt: InstallEvent | null = null;
  let state: PwaState = {
    canInstall: false,
    isIos:
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    offlineReady: false,
    updateAvailable: false,
    installed: window.matchMedia("(display-mode: standalone)").matches,
  };
  const listeners = new Set<(state: PwaState) => void>();
  const emit = (patch: Partial<PwaState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener(state));
  };
  const updateWorker = registerSW({
    immediate: true,
    onOfflineReady() {
      emit({ offlineReady: true });
    },
    onNeedRefresh() {
      emit({ updateAvailable: true });
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      void caches.keys().then((keys) => {
        if (keys.some((key) => key.startsWith("workbox-precache")))
          emit({ offlineReady: true });
      });
    },
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    prompt = event as InstallEvent;
    emit({ canInstall: true });
  });
  window.addEventListener("appinstalled", () => {
    prompt = null;
    emit({ canInstall: false, installed: true });
  });
  return {
    subscribe(callback) {
      listeners.add(callback);
      callback(state);
      return () => {
        listeners.delete(callback);
      };
    },
    async install() {
      if (!prompt) return;
      const active = prompt;
      await active.prompt();
      const choice = await active.userChoice;
      prompt = null;
      emit({
        canInstall: false,
        installed: choice.outcome === "accepted" || state.installed,
      });
    },
    async update() {
      await updateWorker(true);
    },
  };
}
