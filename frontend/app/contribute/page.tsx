"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Canvas from "@/components/Canvas";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type StepState = "drawing" | "submitting" | "done";

export default function ContributePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageState, setPageState] = useState<StepState>("drawing");
  const [error, setError] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState(0); // force Canvas remount to clear it

  const currentDigit = DIGITS[currentIndex];
  const isComplete = pageState === "done";

  const handleSubmit = useCallback(async (imageDataUrl: string) => {
    setPageState("submitting");
    setError(null);

    try {
      const res = await fetch("https://num-rec-api.nmiklavcic.com/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digit: currentDigit, image: imageDataUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      if (currentIndex + 1 >= DIGITS.length) {
        setPageState("done");
      } else {
        setCurrentIndex((i) => i + 1);
        setCanvasKey((k) => k + 1); // remount canvas → clears drawing
        setPageState("drawing");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPageState("drawing");
    }
  }, [currentDigit, currentIndex]);

  if (isComplete) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-bold">Thank you!</h2>
        <p className="text-neutral-400 text-sm text-center max-w-xs">
          You've submitted all 10 digits. Your samples will help improve the model.
        </p>
        <Link
          href="/"
          className="mt-4 px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-neutral-400 text-xs uppercase tracking-widest">Contribute</p>
        <h1 className="text-3xl font-bold">Draw the number</h1>
      </div>

      {/* Digit progress */}
      <div className="flex gap-2">
        {DIGITS.map((d, i) => (
          <div
            key={d}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-mono font-bold transition-colors ${
              i < currentIndex
                ? "bg-neutral-700 text-neutral-500"
                : i === currentIndex
                ? "bg-white text-black"
                : "border border-neutral-700 text-neutral-600"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Big digit prompt */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-9xl font-bold leading-none">{currentDigit}</span>
        <p className="text-neutral-400 text-sm">Draw this digit in the box below</p>
      </div>

      {/* Canvas — key forces remount on digit change */}
      <Canvas
        key={canvasKey}
        onPredict={handleSubmit}
        isLoading={pageState === "submitting"}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Link href="/" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
        ← Back to home
      </Link>
    </main>
  );
}
