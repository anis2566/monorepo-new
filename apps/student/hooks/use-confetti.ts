import confetti from "canvas-confetti";

export function useConfetti() {
  const fireConfetti = (type: "streak" | "bestStreak" = "streak") => {
    if (type === "bestStreak") {
      // Big celebration for new best streak
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else {
      // Quick burst for 5-streak achievement
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#34D399", "#6EE7B7"],
      });
    }
  };

  const fireStreakConfetti = () => fireConfetti("streak");
  const fireBestStreakConfetti = () => fireConfetti("bestStreak");

  return { fireStreakConfetti, fireBestStreakConfetti };
}
