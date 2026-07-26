"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash2, Heart } from "lucide-react";
import { ParentPraise } from "@/components/parent-praise";

const EXAMPLE_ACTIVITIES = ["Играть вместе", "Сказка перед сном"];

const MAX_ACTIVITIES = 4;
const STORAGE_KEY = "parentActivities";

export function ActivitiesPanel() {
  const router = useRouter();

  const [activities, setActivities] = useState<string[]>(() => {
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
  const [showPraise, setShowPraise] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [mode] = useState<"select" | "execute">(() => {
    if (typeof window === "undefined") return "select";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? "execute" : "select";
  });

  const toggleExample = useCallback((activity: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(activity)) {
        next.delete(activity);
      } else if (next.size < MAX_ACTIVITIES) {
        next.add(activity);
      }
      return next;
    });
  }, []);

  const addCustomActivity = useCallback(() => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (selected.has(trimmed) || customActivities.includes(trimmed)) return;
    if (selected.size >= MAX_ACTIVITIES) return;
    setCustomActivities((prev) => [...prev, trimmed]);
    setSelected((prev) => new Set(prev).add(trimmed));
    setCustomInput("");
  }, [customInput, selected, customActivities]);

  const removeCustomActivity = useCallback((activity: string) => {
    setCustomActivities((prev) => prev.filter((a) => a !== activity));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(activity);
      return next;
    });
  }, []);

  const allSelectedActivities = [
    ...EXAMPLE_ACTIVITIES.filter((a) => selected.has(a)),
    ...customActivities.filter((a) => selected.has(a)),
  ];

  const handleSelectDone = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSelectedActivities));
    setActivities(allSelectedActivities);
    router.push("/execute");
  };

  const handleComplete = useCallback(
    (index: number) => {
      if (completed.has(index)) return;
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    },
    [completed]
  );

  const allDone = activities.length > 0 && completed.size === activities.length;

  if (showPraise) {
    return <ParentPraise />;
  }

  if (mode === "execute" && activities.length > 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-sm">
            <Heart className="h-6 w-6 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
            Совместные дела
          </h1>
          <p className="text-sm text-muted-foreground break-words">
            Отмечайте выполненные совместные дела
          </p>
        </div>

        <div className="rounded-xl bg-white/60 p-4 shadow-sm shadow-rose-100/50 backdrop-blur-md space-y-4">
          {activities.map((activity, index) => {
            const isDone = completed.has(index);
            return (
              <div
                key={`${activity}-${index}`}
                className={`group relative flex items-center gap-5 rounded-2xl border-2 p-5 transition-all duration-300 overflow-hidden min-w-0 ${
                  isDone
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/40"
                    : "border-border bg-card hover:border-rose-200 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleComplete(index)}
                  disabled={isDone}
                  className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isDone
                      ? "scale-110 border-green-400 bg-green-400 text-white"
                      : "cursor-pointer border-gray-300 bg-white hover:border-rose-400 hover:bg-rose-50"
                  }`}
                  aria-label={
                    isDone
                      ? "Дело выполнено"
                      : `Отметить "${activity}" как выполненное`
                  }
                >
                  {isDone && (
                    <Check className="h-5 w-5 animate-in zoom-in duration-200" />
                  )}
                </button>

                <span className="text-lg font-medium leading-snug transition-all duration-300 flex-1 break-words">
                  <span className={isDone ? "text-green-600" : ""}>
                    {activity}
                  </span>
                  <span
                    className={`mt-0.5 block h-0.5 w-full rounded-full transition-colors duration-300 ${
                      isDone ? "bg-green-400" : "bg-rose-300"
                    }`}
                  />
                </span>
              </div>
            );
          })}
        </div>

        {activities.length > 0 && (
          <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-pink-50 p-4">
            <p className="text-sm font-medium text-rose-700 break-words">
              Выполнено {completed.size} из {activities.length}
            </p>
          </div>
        )}

        {allDone && (
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            onClick={() => setShowPraise(true)}
          >
            <Heart className="h-4 w-4" />
            Завершить
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-sm">
          <Heart className="h-6 w-6 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
          Совместные дела
        </h1>
        <p className="text-sm text-muted-foreground break-words">
          Выберите дела из списка или добавьте свой вариант
        </p>
      </div>

      <div className="rounded-xl bg-white/60 p-4 shadow-sm shadow-rose-100/50 backdrop-blur-md space-y-3">
        <p className="text-sm font-medium text-muted-foreground break-words">
          Примеры совместных дел
        </p>
        {EXAMPLE_ACTIVITIES.map((activity) => {
          const isSelected = selected.has(activity);
          return (
            <button
              key={activity}
              type="button"
              onClick={() => toggleExample(activity)}
              disabled={!isSelected && selected.size >= MAX_ACTIVITIES}
              className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all card-hover min-w-0 ${
                isSelected
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/20"
              } ${
                !isSelected && selected.size >= MAX_ACTIVITIES
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                }`}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </span>
              <span
                className={`${isSelected ? "font-medium " : ""}flex-1 break-words`}
              >
                {activity}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-white/60 p-4 shadow-sm shadow-rose-100/50 backdrop-blur-md space-y-3">
        <p className="text-sm font-medium text-muted-foreground break-words">
          Свой вариант
        </p>
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomActivity();
              }
            }}
            placeholder="Введите своё совместное дело..."
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addCustomActivity}
            disabled={!customInput.trim() || selected.size >= MAX_ACTIVITIES}
            aria-label="Добавить дело"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {selected.size >= MAX_ACTIVITIES && (
          <p className="text-xs text-muted-foreground">
            Можно добавить не более {MAX_ACTIVITIES} дел
          </p>
        )}

        {customActivities.length > 0 && (
          <div className="space-y-2">
            {customActivities.map((activity) => (
              <div
                key={activity}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm min-w-0"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                <span className="flex-1 font-medium break-words">
                  {activity}
                </span>
                <button
                  type="button"
                  onClick={() => removeCustomActivity(activity)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Удалить ${activity}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {allSelectedActivities.length > 0 && (
        <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-pink-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-rose-700 break-words">
            Совместные дела на сегодня ({allSelectedActivities.length})
          </p>
          <ul className="space-y-1.5">
            {allSelectedActivities.map((activity) => (
              <li
                key={activity}
                className="flex items-center gap-2 text-sm text-rose-900"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                <span className="break-words">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        size="lg"
        className="w-full gap-2 text-base"
        disabled={allSelectedActivities.length === 0}
        onClick={handleSelectDone}
      >
        Далее
      </Button>
    </div>
  );
}
