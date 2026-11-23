import { afterEach, describe, expect, it, vi } from "vitest";
import { createScreenOrientation } from "./screenOrientation";

function browser(standalone = false) {
  const listeners = new Map<string, () => void>();
  const orientation = {
    lock: vi.fn(async () => undefined),
    unlock: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  const root = { requestFullscreen: vi.fn(async () => undefined) };
  const documentMock = {
    documentElement: root,
    fullscreenElement: null as object | null,
    exitFullscreen: vi.fn(async () => undefined),
  };
  root.requestFullscreen.mockImplementation(async () => {
    documentMock.fullscreenElement = root;
  });
  const windowMock = {
    innerWidth: 390,
    innerHeight: 844,
    matchMedia: () => ({ matches: standalone }),
    screen: { orientation },
    addEventListener: vi.fn((event: string, callback: () => void) =>
      listeners.set(event, callback),
    ),
    removeEventListener: vi.fn((event: string) => listeners.delete(event)),
  };
  vi.stubGlobal("window", windowMock);
  vi.stubGlobal("document", documentMock);
  return { orientation, root, documentMock, windowMock, listeners };
}

afterEach(() => vi.unstubAllGlobals());

describe("orientasi layar", () => {
  it("meminta fullscreen sebelum landscape dan melepas yang dimilikinya", async () => {
    const { orientation, root, documentMock } = browser();
    const service = createScreenOrientation();
    await service.requestLandscape();
    expect(root.requestFullscreen).toHaveBeenCalledOnce();
    expect(orientation.lock).toHaveBeenCalledWith("landscape");
    expect(root.requestFullscreen.mock.invocationCallOrder[0]).toBeLessThan(
      orientation.lock.mock.invocationCallOrder[0],
    );
    service.releaseOrientation();
    expect(orientation.unlock).toHaveBeenCalledOnce();
    expect(documentMock.exitFullscreen).toHaveBeenCalledOnce();
  });
  it("PWA standalone tidak meminta fullscreen", async () => {
    const { orientation, root } = browser(true);
    await createScreenOrientation().requestLandscape();
    expect(root.requestFullscreen).not.toHaveBeenCalled();
    expect(orientation.lock).toHaveBeenCalledWith("landscape");
  });
  it("penolakan fullscreen dan lock tidak menghasilkan rejection", async () => {
    const { orientation, root } = browser();
    root.requestFullscreen.mockRejectedValue(new Error("Denied"));
    orientation.lock.mockRejectedValue(new Error("Unsupported"));
    await expect(
      createScreenOrientation().requestLandscape(),
    ).resolves.toBeUndefined();
    expect(orientation.lock).toHaveBeenCalledWith("landscape");
  });
  it("browser tanpa API lock tidak dipaksa fullscreen", async () => {
    const { orientation, root } = browser();
    Object.defineProperty(orientation, "lock", { value: undefined });
    await expect(
      createScreenOrientation().requestLandscape(),
    ).resolves.toBeUndefined();
    expect(root.requestFullscreen).not.toHaveBeenCalled();
  });
  it("resize memperbarui kebutuhan rotasi dan listener dibersihkan", () => {
    const { windowMock, listeners, orientation } = browser();
    const callback = vi.fn();
    const cleanup =
      createScreenOrientation().subscribeRotationRequired(callback);
    expect(callback).toHaveBeenLastCalledWith(true);
    windowMock.innerWidth = 844;
    windowMock.innerHeight = 390;
    listeners.get("resize")?.();
    expect(callback).toHaveBeenLastCalledWith(false);
    cleanup();
    expect(listeners.has("resize")).toBe(false);
    expect(orientation.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
  it("tidak menutup fullscreen yang sudah dibuka pihak lain", async () => {
    const { root, documentMock } = browser();
    documentMock.fullscreenElement = {};
    const service = createScreenOrientation();
    await service.requestLandscape();
    service.releaseOrientation();
    expect(root.requestFullscreen).not.toHaveBeenCalled();
    expect(documentMock.exitFullscreen).not.toHaveBeenCalled();
  });
});
