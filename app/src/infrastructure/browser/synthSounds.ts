const tempoBpm = 112;
const stepSeconds = 60 / tempoBpm / 2;
const lookaheadSeconds = 0.3;
const schedulerIntervalMs = 100;
const menuVolume = 0.14;

// Empat bar (delapan nada per bar) dengan akor C - Am - F - G.
const melody: (number | null)[] = [
  76, 79, 76, 72, 76, 79, 84, 79, 69, 72, 76, 72, 69, 72, 76, 81, 69, 72, 77,
  72, 69, 72, 77, 81, 71, 74, 79, 74, 71, 74, 79, null,
];
const bass = [48, 45, 41, 43];

const midiToHz = (note: number) => 440 * 2 ** ((note - 69) / 12);

export function createSynthSounds() {
  let context: AudioContext | null = null;
  let menu: {
    gain: GainNode;
    timer: number;
    step: number;
    nextTime: number;
  } | null = null;

  const getContext = () => {
    if (!context && "AudioContext" in window) context = new AudioContext();
    return context;
  };

  const tone = (
    ctx: AudioContext,
    destination: AudioNode,
    type: OscillatorType,
    note: number,
    start: number,
    duration: number,
    volume: number,
  ) => {
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = midiToHz(note);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope).connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  };

  const scheduleMenu = (ctx: AudioContext) => {
    if (!menu) return;
    while (menu.nextTime < ctx.currentTime + lookaheadSeconds) {
      const bar = Math.floor(menu.step / 8) % bass.length;
      const inBar = menu.step % 8;
      const note = melody[menu.step % melody.length];
      if (note !== null)
        tone(ctx, menu.gain, "triangle", note, menu.nextTime, 0.28, 0.5);
      if (inBar === 0 || inBar === 4)
        tone(ctx, menu.gain, "sine", bass[bar], menu.nextTime, 0.5, 0.7);
      menu.nextTime += stepSeconds;
      menu.step = (menu.step + 1) % melody.length;
    }
  };

  const resumeOnGesture = () => {
    void context?.resume().catch(() => undefined);
  };
  const resumeOnVisible = () => {
    if (!context) return;
    if (document.hidden) void context.suspend();
    else void context.resume().catch(() => undefined);
  };

  return {
    startMenuMusic() {
      const ctx = getContext();
      if (!ctx || menu) return;
      const gain = ctx.createGain();
      gain.gain.value = menuVolume;
      gain.connect(ctx.destination);
      menu = { gain, timer: 0, step: 0, nextTime: ctx.currentTime + 0.05 };
      menu.timer = window.setInterval(
        () => scheduleMenu(ctx),
        schedulerIntervalMs,
      );
      scheduleMenu(ctx);
      resumeOnGesture();
      // Browser menolak audio sebelum ada interaksi; lanjutkan di sentuhan pertama.
      window.addEventListener("pointerdown", resumeOnGesture);
      window.addEventListener("keydown", resumeOnGesture);
      document.addEventListener("visibilitychange", resumeOnVisible);
    },
    stopMenuMusic() {
      if (!menu || !context) return;
      const { gain, timer } = menu;
      menu = null;
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
      document.removeEventListener("visibilitychange", resumeOnVisible);
      gain.gain.setTargetAtTime(0, context.currentTime, 0.04);
      window.setTimeout(() => gain.disconnect(), 400);
    },
    playCountdownTick() {
      const ctx = getContext();
      if (!ctx) return;
      void ctx.resume().catch(() => undefined);
      tone(ctx, ctx.destination, "sine", 72, ctx.currentTime, 0.22, 0.35);
    },
    playStart() {
      const ctx = getContext();
      if (!ctx) return;
      void ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;
      [84, 88, 91].forEach((note) =>
        tone(ctx, ctx.destination, "triangle", note, now, 0.7, 0.3),
      );
    },
  };
}
