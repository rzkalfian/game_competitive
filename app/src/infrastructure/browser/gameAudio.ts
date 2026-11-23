import type { GameAudio } from "../../application/ports/gameAudio";

const speechTimeoutMs = 6000;

function createTrack(file: string, loop: boolean, volume: number) {
  const element = new Audio(`${import.meta.env.BASE_URL}sound/${file}`);
  element.loop = loop;
  element.volume = volume;
  element.preload = "auto";
  return element;
}

function speak(text: string, isCurrent: () => boolean) {
  return new Promise<void>((resolve) => {
    if (!("speechSynthesis" in window) || !isCurrent()) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    const voice = window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.toLowerCase().startsWith("id"));
    if (voice) utterance.voice = voice;
    const timer = window.setTimeout(resolve, speechTimeoutMs);
    const done = () => {
      window.clearTimeout(timer);
      resolve();
    };
    utterance.onend = done;
    utterance.onerror = done;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

export function createGameAudio(): GameAudio {
  const gameplay = createTrack("gameplay.mp3", true, 0.4);
  const fireworks = createTrack("fireworks.mp3", false, 0.8);
  let celebration = 0;
  const play = (track: HTMLAudioElement) =>
    void track.play().catch(() => undefined);
  const stopCelebration = () => {
    celebration++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    fireworks.pause();
    fireworks.currentTime = 0;
  };
  return {
    startGameplay() {
      play(gameplay);
    },
    pauseGameplay() {
      gameplay.pause();
    },
    stopGameplay() {
      gameplay.pause();
      gameplay.currentTime = 0;
    },
    celebrateWinner(announcement) {
      stopCelebration();
      const active = celebration;
      void speak(announcement, () => active === celebration).then(() => {
        if (active === celebration) play(fireworks);
      });
    },
    stopAll() {
      this.stopGameplay();
      stopCelebration();
    },
  };
}
