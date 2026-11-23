import type { GameServices } from "../../application/ports/gameServices";

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

export function createScreenOrientation(): Pick<
  GameServices,
  "requestLandscape" | "releaseOrientation" | "subscribeRotationRequired"
> {
  let version = 0;
  let ownsLock = false;
  let ownsFullscreen = false;
  const requiresRotation = () => window.innerHeight > window.innerWidth;
  const exitOwnedFullscreen = () => {
    if (ownsFullscreen && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    ownsFullscreen = false;
  };
  return {
    async requestLandscape() {
      const orientation = window.screen.orientation as
        | LockableOrientation
        | undefined;
      if (!orientation?.lock) return;
      const active = ++version;
      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {
        try {
          await document.documentElement.requestFullscreen();
          ownsFullscreen = true;
        } catch {
          ownsFullscreen = false;
        }
      }
      if (active !== version) {
        exitOwnedFullscreen();
        return;
      }
      try {
        await orientation.lock("landscape");
        if (active === version) ownsLock = true;
        else orientation.unlock();
      } catch {
        ownsLock = false;
      }
    },
    releaseOrientation() {
      version++;
      if (ownsLock) window.screen.orientation?.unlock();
      ownsLock = false;
      exitOwnedFullscreen();
    },
    subscribeRotationRequired(callback) {
      const notify = () => callback(requiresRotation());
      window.addEventListener("resize", notify);
      window.screen.orientation?.addEventListener("change", notify);
      notify();
      return () => {
        window.removeEventListener("resize", notify);
        window.screen.orientation?.removeEventListener("change", notify);
      };
    },
  };
}
