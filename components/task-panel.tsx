"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash2, ClipboardList } from "lucide-react";

const MAX_TASKS = 4;
const STORAGE_KEY = "childTasks";

export function TaskPanel() {
  const router = useRouter();
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTask = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (tasks.includes(trimmed)) return;
    if (tasks.length >= MAX_TASKS) return;
    setTasks((prev) => [...prev, trimmed]);
    setInput("");
  }, [input, tasks]);

  const removeTask = useCallback((task: string) => {
    setTasks((prev) => prev.filter((t) => t !== task));
  }, []);

  const handleNext = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    router.push("/rewards");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-sm">
          <ClipboardList className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
          Дела ребёнка
        </h1>
        <p className="text-sm text-muted-foreground break-words">
          Добавьте задание для ребенка и нажмите +
        </p>
      </div>

      <div className="rounded-xl bg-white/60 p-4 shadow-sm shadow-blue-100/50 backdrop-blur-md space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
            placeholder="Введите дело..."
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addTask}
            disabled={!input.trim() || tasks.length >= MAX_TASKS}
            aria-label="Добавить дело"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tasks.length >= MAX_TASKS && (
          <p className="text-xs text-muted-foreground">
            Можно добавить не более {MAX_TASKS} дел
          </p>
        )}

        {tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm min-w-0"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-400">
                  <Check className="h-4 w-4 text-blue-500" />
                </span>
                <span className="flex-1 font-medium break-words">{task}</span>
                <button
                  type="button"
                  onClick={() => removeTask(task)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Удалить ${task}`}
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
        disabled={tasks.length === 0}
        onClick={handleNext}
      >
        Далее
      </Button>
    </div>
  );
}
