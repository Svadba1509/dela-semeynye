import { ExecutePanel } from "@/components/execute-panel";
import { BackButton } from "@/components/back-button";

export default function ExecutePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-sky-50 via-indigo-50 to-purple-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #a5b4fc 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 max-w-lg overflow-hidden break-words min-w-0">
        <div className="mb-6">
          <BackButton />
        </div>
        <ExecutePanel />
      </div>
    </div>
  );
}
