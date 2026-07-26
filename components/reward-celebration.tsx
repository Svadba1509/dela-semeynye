"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Star, Sparkles } from "lucide-react";
import { playFanfareSound } from "@/lib/sounds";

const REWARDS_STORAGE_KEY = "rewards";
const FIREWORK_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF6B9D", "#C084FC", "#FB923C", "#38BDF8",
  "#34D399", "#F472B6", "#A78BFA", "#FBBF24",
];

interface FireworkParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
  delay: number;
  size: number;
  duration: number;
}

interface SparkleStar {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  duration: number;
  animation: "float" | "twinkle" | "drift";
  colorClass: string;
}

function generateBurst(prefix: string, cx: number, cy: number, count: number): FireworkParticle[] {
  const particles: FireworkParticle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const velocity = 2 + Math.random() * 5;
    particles.push({
      id: `${prefix}-${i}`,
      x: cx,
      y: cy,
      color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      tx: Math.cos(angle) * velocity * 30,
      ty: Math.sin(angle) * velocity * 30,
      delay: Math.random() * 0.15,
      size: 4 + Math.random() * 5,
      duration: 0.8 + Math.random() * 0.6,
    });
  }
  return particles;
}

function generateInitialFireworks(): FireworkParticle[] {
  const bursts = [
    { x: 20, y: 25 }, { x: 80, y: 20 },
    { x: 50, y: 15 }, { x: 35, y: 30 }, { x: 65, y: 28 },
  ];
  const all: FireworkParticle[] = [];
  bursts.forEach((pos, i) => {
    all.push(...generateBurst(`init-${i}`, pos.x, pos.y, 16));
  });
  return all;
}

const STAR_COLORS = [
  "text-yellow-300 fill-yellow-300/60",
  "text-white fill-white/40",
  "text-amber-200 fill-amber-200/50",
  "text-yellow-100 fill-yellow-100/40",
  "text-orange-200 fill-orange-200/40",
];

function generateStars(): SparkleStar[] {
  const s: SparkleStar[] = [];
  for (let i = 0; i < 35; i++) {
    const animType: SparkleStar["animation"] = i < 12 ? "float" : i < 24 ? "twinkle" : "drift";
    s.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: animType === "twinkle" ? 5 + Math.random() * 7 : 7 + Math.random() * 14,
      duration: animType === "twinkle" ? 1.5 + Math.random() * 1.5 : animType === "drift" ? 4 + Math.random() * 3 : 2.5 + Math.random() * 2.5,
      animation: animType,
      colorClass: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    });
  }
  return s;
}

export function RewardCelebration() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [rewards] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(REWARDS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [burstSeed, setBurstSeed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      playFanfareSound();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setBurstSeed((s) => s + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [show]);

  const fireworks = useMemo(() => generateInitialFireworks(), [burstSeed]);
  const stars = useMemo(() => generateStars(), [show]);

  return (
    <div className="relative min-h-dvh flex flex-col bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-firework-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {stars.map((s) => {
        const animClass = s.animation === "twinkle" ? "animate-twinkle-star" : s.animation === "drift" ? "animate-drift-star" : "animate-float-star";
        return (
          <div
            key={s.id}
            className={`absolute pointer-events-none ${animClass}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            <Star className={s.colorClass} style={{ width: s.size, height: s.size }} />
          </div>
        );
      })}

      <div className="relative z-10 p-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-8 -mt-16">
        <div className="animate-cup-bounce">
          <div className="text-7xl sm:text-8xl animate-cup-glow">🏆</div>
        </div>

        {show && (
          <div className="animate-reward-bounce w-full max-w-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-400 p-1 shadow-2xl shadow-yellow-500/30">
              <div className="rounded-xl bg-white/95 p-6 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    Твоя награда!
                  </h2>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                {rewards.length > 0 ? (
                  <ul className="space-y-2">
                    {rewards.map((reward, i) => (
                      <li key={i} className="text-lg font-medium text-gray-700 flex items-center gap-2 justify-center min-w-0">
                        <span className="text-yellow-500 shrink-0">⭐</span>
                        <span className="break-words text-center">{reward}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Награда не выбрана</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-6">
        <Button
          size="lg"
          className="w-full gap-2 text-base bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg border-0"
          onClick={() => {
            localStorage.removeItem("childTasks");
            localStorage.removeItem("rewards");
            router.push("/parent");
          }}
        >
          Далее
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes firework-particle {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
        }
        @keyframes cup-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes cup-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.6)); }
          50% { filter: drop-shadow(0 0 24px rgba(234, 179, 8, 0.9)); }
        }
        @keyframes reward-bounce {
          0% { opacity: 0; transform: translateY(80px) scale(0.6); }
          50% { opacity: 1; transform: translateY(-10px) scale(1.03); }
          70% { transform: translateY(4px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes drift-star {
          0%, 100% { opacity: 0.2; transform: translateY(0) translateX(0) scale(0.7); }
          33% { opacity: 0.8; transform: translateY(-18px) translateX(12px) scale(1.1); }
          66% { opacity: 0.4; transform: translateY(-6px) translateX(-10px) scale(0.85); }
        }
        @keyframes float-star {
          0%, 100% { opacity: 0.2; transform: translateY(0) scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: translateY(-20px) scale(1.2) rotate(20deg); }
        }
        .animate-firework-particle { animation: firework-particle ease-out forwards; }
        .animate-cup-bounce { animation: cup-bounce 3s ease-in-out infinite; }
        .animate-cup-glow { animation: cup-glow 2s ease-in-out infinite; }
        .animate-reward-bounce { animation: reward-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-twinkle-star { animation: twinkle-star ease-in-out infinite; }
        .animate-drift-star { animation: drift-star ease-in-out infinite; }
        .animate-float-star { animation: float-star 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
