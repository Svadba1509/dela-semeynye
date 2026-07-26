"use client";

import { Heart, Sparkles } from "lucide-react";
import { FloatingHearts } from "@/components/floating-hearts";
import { Button } from "@/components/ui/button";

export function ParentPraise() {
  const handleGoHome = () => {
    localStorage.removeItem("childTasks");
    localStorage.removeItem("rewards");
    localStorage.removeItem("parentActivities");
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-rose-50 to-pink-100 p-6">
      <FloatingHearts />
      <div className="max-w-sm text-center space-y-6 animate-in zoom-in duration-500">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-pink-200 shadow-lg">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-rose-800">
          Вы чудесный родитель!
        </h2>
        <p className="text-base text-rose-700 leading-relaxed">
          Спасибо, что проводите время с ребёнком — эти моменты остаются в
          сердце навсегда. Вы — самый лучший пример для своего малыша!
        </p>
        <Button
          size="lg"
          className="gap-2 text-base bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 shadow-lg border-0"
          onClick={handleGoHome}
        >
          <Sparkles className="h-4 w-4" />
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
