"use client";

import { useState, useCallback } from "react";
import Canvas from "@/components/Canvas";
import Result from "@/components/Result";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

interface PredictionResult {
  digit: number;
  confidence: number;
  probabilities: number[];
}

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = useCallback(async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-12">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Numeral Recognizer</h1>
        <p className="text-neutral-400 text-sm">
          Draw a digit (0–9) and hit Predict
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        <Canvas onPredict={handlePredict} isLoading={isLoading} />

        <div className="w-px bg-neutral-800 self-stretch hidden lg:block" />

        <div className="flex items-center justify-center min-w-[220px]">
          {result ? (
            <Result
              digit={result.digit}
              confidence={result.confidence}
              probabilities={result.probabilities}
            />
          ) : (
            <p className="text-neutral-600 text-sm">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                "Result will appear here"
              )}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
