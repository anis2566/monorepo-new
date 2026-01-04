import { useCallback, useRef } from "react";

// Audio context for generating tones
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  return audioContext;
};

export function useAudioFeedback() {
  const isEnabledRef = useRef(true);

  const playCorrectSound = useCallback(() => {
    if (!isEnabledRef.current) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Pleasant ascending tone for correct answer
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (error) {
      console.log("Audio not available");
    }
  }, []);

  const playIncorrectSound = useCallback(() => {
    if (!isEnabledRef.current) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Descending buzz for incorrect answer
      oscillator.frequency.setValueAtTime(311.13, ctx.currentTime); // Eb4
      oscillator.frequency.setValueAtTime(277.18, ctx.currentTime + 0.15); // Db4

      oscillator.type = "sawtooth";
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.log("Audio not available");
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  return { playCorrectSound, playIncorrectSound, setEnabled };
}
