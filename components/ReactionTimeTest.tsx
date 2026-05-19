"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "waiting" | "ready" | "too-early" | "result";

const MIN_WAIT_MS = 1000;
const MAX_WAIT_MS = 5000;

function randomWaitMs() {
  return MIN_WAIT_MS + Math.floor(Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS + 1));
}

export function ReactionTimeTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const readyAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWaitTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearWaitTimeout(), [clearWaitTimeout]);

  const startRound = useCallback(() => {
    clearWaitTimeout();
    readyAtRef.current = null;
    setReactionMs(null);
    setPhase("waiting");

    timeoutRef.current = setTimeout(() => {
      readyAtRef.current = performance.now();
      setPhase("ready");
      timeoutRef.current = null;
    }, randomWaitMs());
  }, [clearWaitTimeout]);

  const handlePadClick = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "too-early") {
      startRound();
      return;
    }

    if (phase === "waiting") {
      clearWaitTimeout();
      readyAtRef.current = null;
      setPhase("too-early");
      return;
    }

    if (phase === "ready" && readyAtRef.current !== null) {
      const ms = Math.round(performance.now() - readyAtRef.current);
      setReactionMs(ms);
      setPhase("result");
      readyAtRef.current = null;
    }
  }, [phase, startRound, clearWaitTimeout]);

  const padStyles: Record<Phase, string> = {
    idle: "border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
    waiting: "border-red-400 bg-red-600 text-white cursor-pointer",
    ready: "border-green-500 bg-green-500 text-white cursor-pointer",
    "too-early": "border-amber-500 bg-amber-100 text-amber-900 cursor-pointer",
    result: "border-[#c41230]/40 bg-white text-neutral-900 cursor-pointer hover:border-[#c41230]",
  };

  const padMessage: Record<Phase, string> = {
    idle: "Click to start",
    waiting: "Wait for green…",
    ready: "Click now!",
    "too-early": "Too early! Click to try again",
    result: reactionMs !== null ? `${reactionMs} ms` : "—",
  };

  const hint =
    phase === "idle"
      ? "The screen turns green after a random 1–5 second delay. Click as soon as you see it."
      : phase === "waiting"
        ? "Don't click yet."
        : phase === "ready"
          ? "Green means go."
          : phase === "too-early"
            ? "Patience. Wait for the green flash."
            : reactionMs !== null
              ? reactionMs < 200
                ? "Lightning fast—or suspiciously so."
                : reactionMs < 350
                  ? "Solid reflexes. The newsroom approves."
                  : "Still faster than our fact-checking department."
              : "";

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="font-sans text-sm text-neutral-600">
        Test how quickly you can react when the pad turns green.
      </p>

      <button
        type="button"
        onClick={handlePadClick}
        className={`mt-6 flex h-48 w-full flex-col items-center justify-center rounded-xl border-4 px-4 transition-colors ${padStyles[phase]}`}
        aria-live="polite"
      >
        <span className="font-serif text-3xl font-bold sm:text-4xl">{padMessage[phase]}</span>
        {phase === "result" && reactionMs !== null && (
          <span className="mt-2 font-sans text-sm font-medium opacity-80">Tap to play again</span>
        )}
      </button>

      <p className="mt-4 min-h-[2.5rem] text-center font-sans text-sm text-neutral-600">{hint}</p>
    </div>
  );
}
