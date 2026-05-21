"use client";

import { useCoins } from "@/components/CoinsProvider";
import {
  PLINKO_DEFAULT_BET,
  PLINKO_MAX_BET,
  PLINKO_MIN_BET,
  PLINKO_PHYSICS,
  PLINKO_RISKS,
  PLINKO_ROW_OPTIONS,
  formatMultiplier,
  getPlinkoMultipliers,
  plinkoSlotColor,
  type PlinkoRisk,
  type PlinkoRows,
} from "@/lib/plinko";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const CANVAS_W = 500;
const CANVAS_H = 600;
const PEG_RADIUS = 3.2;
const BALL_RADIUS = 5.5;
const TOP_PADDING = 30;
const BOTTOM_PADDING = 70;
const SIDE_PADDING = 18;
const SLOT_HEIGHT = 36;

type Peg = { x: number; y: number };

type Ball = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bet: number;
  done: boolean;
  cooldown: number;
  /** Captured at drop time so changing risk mid-flight doesn't repay. */
  multipliers: number[];
};

type ResultEntry = {
  id: number;
  multiplier: number;
  payout: number;
  bet: number;
  slot: number;
};

type Layout = {
  pegs: Peg[];
  slotCenters: number[];
  slotsTopY: number;
  slotWidth: number;
};

function buildLayout(rows: PlinkoRows): Layout {
  const usableW = CANVAS_W - SIDE_PADDING * 2;
  const spacingX = (usableW * 0.92) / rows;
  const usableH = CANVAS_H - TOP_PADDING - BOTTOM_PADDING;
  const spacingY = usableH / rows;
  const cx = CANVAS_W / 2;

  const pegs: Peg[] = [];
  for (let r = 0; r < rows; r++) {
    const numPegs = r + 2;
    const rowWidth = (numPegs - 1) * spacingX;
    const startX = cx - rowWidth / 2;
    const y = TOP_PADDING + (r + 1) * spacingY;
    for (let i = 0; i < numPegs; i++) {
      pegs.push({ x: startX + i * spacingX, y });
    }
  }

  const bottomRowNumPegs = rows + 1;
  const bottomRowWidth = (bottomRowNumPegs - 1) * spacingX;
  const startX = cx - bottomRowWidth / 2;
  const slotCenters: number[] = [];
  for (let i = 0; i < bottomRowNumPegs; i++) {
    slotCenters.push(startX + i * spacingX);
  }

  const slotsTopY = TOP_PADDING + rows * spacingY + 16;
  return {
    pegs,
    slotCenters,
    slotsTopY,
    slotWidth: spacingX,
  };
}

export function Plinko() {
  const { balance, ready, trySpend, addCoins } = useCoins();
  const [bet, setBet] = useState<number>(PLINKO_DEFAULT_BET);
  const [risk, setRisk] = useState<PlinkoRisk>("medium");
  const [rows, setRows] = useState<PlinkoRows>(8);
  const [history, setHistory] = useState<ResultEntry[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const multipliers = useMemo(() => getPlinkoMultipliers(rows, risk), [rows, risk]);
  const layout = useMemo(() => buildLayout(rows), [rows]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const rafRef = useRef<number | null>(null);
  const activeSlotRef = useRef<number | null>(null);

  const layoutRef = useRef(layout);
  const multipliersRef = useRef(multipliers);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    layoutRef.current = layout;
    // Clear in-flight balls — old positions are no longer valid for the new peg layout.
    ballsRef.current = [];
  }, [layout]);
  useEffect(() => {
    multipliersRef.current = multipliers;
  }, [multipliers]);

  const addCoinsRef = useRef(addCoins);
  useEffect(() => {
    addCoinsRef.current = addCoins;
  }, [addCoins]);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  const finalizeBall = useCallback((ball: Ball) => {
    const { slotCenters } = layoutRef.current;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < slotCenters.length; i++) {
      const d = Math.abs(ball.x - slotCenters[i]);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    const mults = ball.multipliers;
    const safeIndex = Math.max(0, Math.min(mults.length - 1, best));
    const multiplier = mults[safeIndex];
    const payout = Math.round(ball.bet * multiplier);
    if (payout > 0) addCoinsRef.current(payout);

    setActiveSlot(safeIndex);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setActiveSlot(null), 900);

    setHistory((prev) =>
      [{ id: ball.id, multiplier, payout, bet: ball.bet, slot: safeIndex }, ...prev].slice(0, 12),
    );
    const net = payout - ball.bet;
    setMessage(
      `${formatMultiplier(multiplier)} · ${payout >= 0 ? "+" : ""}${payout} coins (net ${net >= 0 ? "+" : ""}${net})`,
    );
  }, []);

  const finalizeBallRef = useRef(finalizeBall);
  useEffect(() => {
    finalizeBallRef.current = finalizeBall;
  }, [finalizeBall]);

  // DPR-aware canvas sizing
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Persistent animation loop — pegs/multipliers change via refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();
    const draw = (now: number) => {
      const dtMs = Math.min(48, now - last);
      last = now;
      const dt = dtMs / 16.6667; // normalize to ~60fps frame
      const sub = PLINKO_PHYSICS.subSteps;
      const subDt = dt / sub;

      const { pegs, slotsTopY } = layoutRef.current;
      const balls = ballsRef.current;

      for (let s = 0; s < sub; s++) {
        for (const ball of balls) {
          if (ball.done) {
            // Let it keep falling for visual finish
            ball.vy += PLINKO_PHYSICS.gravity * subDt;
            ball.y += ball.vy * subDt;
            continue;
          }

          ball.vy += PLINKO_PHYSICS.gravity * subDt;
          ball.vx *= Math.pow(PLINKO_PHYSICS.airFriction, subDt);
          if (ball.vx > PLINKO_PHYSICS.maxVx) ball.vx = PLINKO_PHYSICS.maxVx;
          if (ball.vx < -PLINKO_PHYSICS.maxVx) ball.vx = -PLINKO_PHYSICS.maxVx;
          ball.x += ball.vx * subDt;
          ball.y += ball.vy * subDt;
          if (ball.cooldown > 0) ball.cooldown -= 1;

          if (ball.x - BALL_RADIUS < SIDE_PADDING) {
            ball.x = SIDE_PADDING + BALL_RADIUS;
            ball.vx = Math.abs(ball.vx) * PLINKO_PHYSICS.restitution;
          }
          if (ball.x + BALL_RADIUS > CANVAS_W - SIDE_PADDING) {
            ball.x = CANVAS_W - SIDE_PADDING - BALL_RADIUS;
            ball.vx = -Math.abs(ball.vx) * PLINKO_PHYSICS.restitution;
          }

          for (const peg of pegs) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distSq = dx * dx + dy * dy;
            const minDist = BALL_RADIUS + PEG_RADIUS;
            if (distSq < minDist * minDist) {
              const dist = Math.sqrt(distSq) || 0.0001;
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minDist - dist;
              ball.x += nx * overlap;
              ball.y += ny * overlap;
              const dot = ball.vx * nx + ball.vy * ny;
              if (dot < 0) {
                ball.vx = (ball.vx - 2 * dot * nx) * PLINKO_PHYSICS.restitution;
                ball.vy = (ball.vy - 2 * dot * ny) * PLINKO_PHYSICS.restitution;
                if (ball.cooldown <= 0) {
                  ball.vx += (Math.random() - 0.5) * PLINKO_PHYSICS.pegJitter;
                  ball.cooldown = 2;
                }
              }
            }
          }

          if (ball.y > slotsTopY) {
            ball.done = true;
            finalizeBallRef.current(ball);
          }
        }
      }

      // Cull off-screen balls
      ballsRef.current = balls.filter((b) => b.y < CANVAS_H + 40);

      // ---- Render ----
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      bg.addColorStop(0, "#0d0610");
      bg.addColorStop(1, "#1a0d1c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Pegs
      for (const peg of pegs) {
        ctx.beginPath();
        ctx.fillStyle = "#f5f5f4";
        ctx.shadowColor = "rgba(255,255,255,0.25)";
        ctx.shadowBlur = 3;
        ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Slots (drawn inside canvas for pixel-perfect alignment)
      const { slotCenters, slotWidth } = layoutRef.current;
      const mults = multipliersRef.current;
      const slotsY = slotsTopY;
      for (let i = 0; i < slotCenters.length; i++) {
        const m = mults[i];
        const isHotFlash = activeSlotRef.current === i;
        const baseColor = plinkoSlotColor(m);
        const x = slotCenters[i] - slotWidth / 2 + 2;
        const w = slotWidth - 4;
        const h = SLOT_HEIGHT - 4;

        // Drop shadow when flashing
        if (isHotFlash) {
          ctx.shadowColor = "#fde047";
          ctx.shadowBlur = 18;
        }
        ctx.fillStyle = baseColor;
        roundRect(ctx, x, slotsY, w, h, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isHotFlash) {
          ctx.strokeStyle = "#fde047";
          ctx.lineWidth = 2;
          roundRect(ctx, x, slotsY, w, h, 6);
          ctx.stroke();
        }

        ctx.fillStyle = "#1a0d1c";
        ctx.font = "bold 11px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(formatMultiplier(m), slotCenters[i], slotsY + h / 2);
      }

      // Balls last so they sit on top
      for (const ball of balls) {
        const grad = ctx.createRadialGradient(
          ball.x - 2,
          ball.y - 2,
          1,
          ball.x,
          ball.y,
          BALL_RADIUS,
        );
        grad.addColorStop(0, "#fca5a5");
        grad.addColorStop(1, "#dc2626");
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(239,68,68,0.6)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const drop = useCallback(() => {
    if (!ready) return;
    const amount = Math.max(PLINKO_MIN_BET, Math.min(PLINKO_MAX_BET, Math.floor(bet) || 0));
    if (amount <= 0) {
      setMessage(`Bet must be at least ${PLINKO_MIN_BET} coin.`);
      return;
    }
    if (!trySpend(amount)) {
      setMessage("Not enough coins for that bet.");
      return;
    }
    const cx = CANVAS_W / 2;
    const newBall: Ball = {
      id: performance.now() + Math.random(),
      x: cx + (Math.random() - 0.5) * 6,
      y: 8,
      vx: (Math.random() - 0.5) * 2 * PLINKO_PHYSICS.spawnVx,
      vy: 0,
      bet: amount,
      done: false,
      cooldown: 0,
      multipliers: multipliersRef.current.slice(),
    };
    ballsRef.current.push(newBall);
  }, [bet, ready, trySpend]);

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setBet(0);
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) setBet(n);
  };

  const adjustBet = (factor: number) => {
    setBet((prev) => {
      const next = Math.max(PLINKO_MIN_BET, Math.floor(prev * factor));
      return Math.min(PLINKO_MAX_BET, next);
    });
  };

  const canAfford = balance >= bet && bet >= PLINKO_MIN_BET;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#2a1528] to-[#120a14] p-5 shadow-2xl shadow-black/50 sm:p-6">
      <p className="text-center font-sans text-sm text-amber-100/70">
        Drop chips through the pegs. Land in a multiplier slot — your bet pays out at that
        multiplier. Bigger multipliers sit on the outer edges and are rare.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Risk
          </span>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value as PlinkoRisk)}
            className="rounded-lg border border-amber-500/50 bg-[#0d0610] px-3 py-2 font-sans text-sm text-amber-100 focus:border-amber-300 focus:outline-none"
          >
            {PLINKO_RISKS.map((r) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Rows
          </span>
          <select
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value, 10) as PlinkoRows)}
            className="rounded-lg border border-amber-500/50 bg-[#0d0610] px-3 py-2 font-sans text-sm text-amber-100 focus:border-amber-300 focus:outline-none"
          >
            {PLINKO_ROW_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Bet (coins)
          </span>
          <div className="flex items-stretch gap-1">
            <button
              type="button"
              onClick={() => adjustBet(0.5)}
              className="rounded-lg border border-amber-500/40 bg-[#0d0610] px-2 font-sans text-xs text-amber-200 hover:border-amber-300"
            >
              ½
            </button>
            <input
              type="number"
              min={PLINKO_MIN_BET}
              max={PLINKO_MAX_BET}
              value={bet === 0 ? "" : bet}
              onChange={onBetChange}
              className="w-full rounded-lg border border-amber-500/50 bg-[#0d0610] px-3 py-2 text-center font-sans text-sm text-amber-100 focus:border-amber-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => adjustBet(2)}
              className="rounded-lg border border-amber-500/40 bg-[#0d0610] px-2 font-sans text-xs text-amber-200 hover:border-amber-300"
            >
              2×
            </button>
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_140px]">
        <div className="relative mx-auto w-full max-w-[500px]">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
            className="rounded-xl border-2 border-amber-600/40 shadow-lg shadow-black/40"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={drop}
            disabled={!ready || !canAfford}
            className="rounded-full bg-gradient-to-b from-emerald-400 to-emerald-700 px-6 py-3 font-sans text-sm font-bold uppercase tracking-wider text-emerald-950 shadow-lg transition hover:from-emerald-300 disabled:cursor-not-allowed disabled:from-stone-600 disabled:to-stone-800 disabled:text-stone-300"
          >
            {canAfford ? `Drop (−${bet})` : `Need ${bet} coins`}
          </button>

          <div className="rounded-lg border border-amber-500/30 bg-black/30 p-3">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Recent
            </p>
            <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto font-mono text-[11px]">
              {history.length === 0 && (
                <li className="text-amber-100/40">— no drops yet —</li>
              )}
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between rounded px-2 py-1"
                  style={{ background: `${plinkoSlotColor(h.multiplier)}30` }}
                >
                  <span
                    className="font-bold"
                    style={{ color: plinkoSlotColor(h.multiplier) }}
                  >
                    {formatMultiplier(h.multiplier)}
                  </span>
                  <span
                    className={
                      h.payout - h.bet >= 0 ? "text-emerald-300" : "text-rose-300"
                    }
                  >
                    {h.payout - h.bet >= 0 ? "+" : ""}
                    {h.payout - h.bet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-amber-500/50 bg-amber-950/40 p-4 text-center">
          <p className="font-sans text-sm text-amber-100">{message}</p>
        </div>
      )}
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
