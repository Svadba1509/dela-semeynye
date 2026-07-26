"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { playTaskCompleteSound } from "@/lib/sounds";
import { Button } from "@/components/ui/button";
import { RewardCelebration } from "@/components/reward-celebration";

const TASK_EMOJI: Record<string, string> = {
  "Убрать игрушки": "🧸",
  "Сделать уроки": "📚",
  "Выучить стих": "📝",
  "Заправить кровать": "🛏️",
  "Почистить зубы": "🪥",
  Одеться: "👕",
  Покушать: "🍽️",
  "Помыть посуду": "🍽️",
  "Полить цветы": "🌷",
  "Покормить питомца": "🐾",
  Пропылесосить: "🧹",
  "Помыть обувь": "👟",
};

const FALLBACK_EMOJIS = ["⭐"];
const STORAGE_KEY = "childTasks";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  shape: "circle" | "square" | "star";
  tx: number;
  ty: number;
}

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF6B9D", "#C084FC", "#FB923C", "#38BDF8",
];

function getEmoji(task: string): string {
  return TASK_EMOJI[task] ?? FALLBACK_EMOJIS[0];
}

function generateParticles(originX: number, originY: number, count: number = 30): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: originX + (Math.random() - 0.5) * 300,
      y: originY + (Math.random() - 0.5) * 300,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 720 - 360,
      scale: 0.3 + Math.random() * 0.8,
      shape: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
      tx: (Math.random() - 0.5) * 400,
      ty: (Math.random() - 0.5) * 400,
    });
  }
  return particles;
}

export function ExecutePanel() {
  const router = useRouter();
  const [tasks] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleComplete = useCallback(
    (index: number) => {
      if (completed.has(index)) return;
      setCompleted((prev) => new Set(prev).add(index));
      playTaskCompleteSound();

      const el = taskRefs.current[index];
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setParticles(generateParticles(cx, cy));
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setParticles([]);
        }, 1500);
      }
    },
    [completed]
  );

  const allDone = tasks.length > 0 && completed.size === tasks.length;

  if (showReward) {
    return <RewardCelebration />;
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 break-words">
        <div className="py-16 text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-sm">
            <Sparkles className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight break-words">
            Нет задач на сегодня
          </h1>
          <p className="text-sm text-muted-foreground break-words">
            Сначала выберите дела на странице задач
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 break-words">
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-sm">
          <Sparkles className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
          Мои дела
        </h1>
        <p className="text-sm text-muted-foreground break-words">
          Нажимай на кружок, когда выполнишь дело
        </p>
      </div>

      {allDone && (
        <div className="pt-2">
          <Button
            size="lg"
            className="w-full gap-2 text-base bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-lg border-0"
            onClick={() => setShowReward(true)}
          >
            Далее
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2 break-words">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Выполнено {completed.size} из {tasks.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round((completed.size / tasks.length) * 100)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${(completed.size / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 break-words">
        {tasks.map((task, index) => {
          const isDone = completed.has(index);
          return (
            <div
              key={`${task}-${index}`}
              ref={(el) => { taskRefs.current[index] = el; }}
              className={`group relative flex items-center gap-5 rounded-2xl border-2 p-5 transition-all duration-300 overflow-hidden min-w-0 break-words ${
                isDone
                  ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/40"
                  : "border-border bg-card hover:border-blue-200 hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => handleComplete(index)}
                disabled={isDone}
                className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isDone
                    ? "scale-110 border-green-400 bg-green-400 text-white"
                    : "cursor-pointer border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                }`}
                aria-label={isDone ? "Задача выполнена" : `Отметить "${task}" как выполненное`}
              >
                {isDone && <Check className="h-5 w-5 animate-in zoom-in duration-200" />}
              </button>

              <span className="shrink-0 text-2xl">{getEmoji(task)}</span>

              <span className={`text-lg font-medium leading-snug transition-all duration-300 flex-1 break-words min-w-0 ${isDone ? "text-green-600" : ""}`}>
                {task}
                <span className="mt-0.5 block h-0.5 w-full rounded-full bg-red-400" />
              </span>
            </div>
          );
        })}
      </div>

      {showCelebration && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute animate-confetti"
              style={{
                left: "50%",
                top: "50%",
                width: p.shape === "star" ? "14px" : "10px",
                height: p.shape === "star" ? "14px" : "10px",
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : undefined,
                clipPath: p.shape === "star" ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : undefined,
                transform: `translate(${p.x - window.innerWidth / 2}px, ${p.y - window.innerHeight / 2}px)`,
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                "--r": `${p.rotation}deg`,
                "--s": p.scale,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(var(--s)); }
        }
        .animate-confetti { animation: confetti-fall 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
