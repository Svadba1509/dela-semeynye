"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash2, Gift } from "lucide-react";

const MAX_REWARDS = 4;
const STORAGE_KEY = "rewards";

export function RewardsPanel() {
  const router = useRouter();
  const [rewards, setRewards] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addReward = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (rewards.includes(trimmed)) return;
    if (rewards.length >= MAX_REWARDS) return;
    setRewards((prev) => [...prev, trimmed]);
    setInput("");
  }, [input, rewards]);

  const removeReward = useCallback((reward: string) => {
    setRewards((prev) => prev.filter((r) => r !== reward));
  }, []);

  const handleNext = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
    router.push("/parent");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 shadow-sm">
          <Gift className="h-6 w-6 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
          Награды
        </h1>
        <p className="text-sm text-muted-foreground break-words">
          Добавьте награды,которые ребенок получит после выполнения задач и нажмите +
        </p>
      </div>

      <div className="rounded-xl bg-white/60 p-4 shadow-sm shadow-amber-100/50 backdrop-blur-md space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addReward();
              }
            }}
            placeholder="Введите награду..."
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addReward}
            disabled={!input.trim() || rewards.length >= MAX_REWARDS}
            aria-label="Добавить награду"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {rewards.length >= MAX_REWARDS && (
          <p className="text-xs text-muted-foreground">
            Можно добавить не более {MAX_REWARDS} наград
          </p>
        )}

        {rewards.length > 0 && (
          <div className="space-y-2">
            {rewards.map((reward) => (
              <div
                key={reward}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm min-w-0"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-yellow-400">
                  <Check className="h-4 w-4 text-yellow-500" />
                </span>
                <span className="flex-1 font-medium break-words">{reward}</span>
                <button
                  type="button"
                  onClick={() => removeReward(reward)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Удалить ${reward}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 text-base"
        disabled={rewards.length === 0}
        onClick={handleNext}
      >
        Далее
      </Button>
    </div>
  );
}
