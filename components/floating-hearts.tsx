"use client";

import { Heart } from "lucide-react";

const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  size: 12 + Math.random() * 16,
  duration: 3 + Math.random() * 3,
}));

export function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {HEARTS.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            bottom: "-20px",
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <Heart
            className="text-rose-300/60"
            style={{ width: heart.size, height: heart.size }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(1.2) rotate(20deg);
          }
        }
        .animate-float-up {
          animation: float-up ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
