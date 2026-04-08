"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface CanvasProps {
  onPredict: (imageDataUrl: string) => void;
  isLoading: boolean;
  submitLabel?: string;
}

export default function Canvas({ onPredict, isLoading, submitLabel = "Predict" }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing.current = true;
    setIsEmpty(false);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, []);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }, []);

  const handlePredict = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onPredict(canvas.toDataURL("image/png"));
  }, [onPredict]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="border-2 border-neutral-600 rounded-lg cursor-crosshair touch-none"
        style={{ width: "280px", height: "280px", background: "#fff" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="flex gap-3">
        <button
          onClick={clear}
          className="px-5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handlePredict}
          disabled={isEmpty || isLoading}
          className="px-5 py-2 rounded-lg bg-white text-black text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-200"
        >
          {isLoading ? `${submitLabel}…` : submitLabel}
        </button>
      </div>
    </div>
  );
}
