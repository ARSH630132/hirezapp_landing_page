"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];
type NodeKey =
  | "entry"
  | "canada"
  | "usa"
  | "mexico"
  | "brazil"
  | "uk"
  | "france"
  | "germany"
  | "spain"
  | "italy"
  | "russia"
  | "dubai"
  | "india"
  | "china"
  | "japan"
  | "korea"
  | "singapore"
  | "thailand"
  | "southAfrica"
  | "egypt"
  | "nigeria"
  | "australia"
  | "newZealand";

type Link = [NodeKey, NodeKey];

export default function Map3DEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const MAP_BASE_W = 848.9999389648438;
  const MAP_BASE_H = 503.4253234863281;

  const rawPoints: Record<string, [number, number]> = {
    entry: [60, 170],
    canada: [250, 95],
    usa: [220, 150],
    mexico: [245, 205],
    brazil: [320, 315],
    uk: [430, 125],
    france: [455, 150],
    germany: [485, 135],
    russia: [610, 95],
    dubai: [545, 190],
    india: [610, 225],
    china: [690, 175],
    japan: [790, 190],
    singapore: [690, 270],
    southAfrica: [520, 345],
    australia: [760, 360],
  };

  const links: [string, string][] = [
    ["entry", "usa"],
    ["entry", "canada"],
    ["canada", "usa"],
    ["usa", "mexico"],
    ["usa", "uk"],
    ["mexico", "brazil"],
    ["uk", "france"],
    ["france", "germany"],
    ["germany", "russia"],
    ["france", "dubai"],
    ["dubai", "india"],
    ["india", "china"],
    ["china", "japan"],
    ["india", "singapore"],
    ["singapore", "australia"],
    ["dubai", "southAfrica"],
    ["southAfrica", "australia"],
  ];

  const outgoing = new Map<string, number[]>();
  links.forEach(([from], i) => {
    const arr = outgoing.get(from) ?? [];
    arr.push(i);
    outgoing.set(from, arr);
  });

  const controlPoint = (a: [number, number], b: [number, number]): [number, number] => {
    const [x1, y1] = a;
    const [x2, y2] = b;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const lift = Math.min(72, len * 0.28);
    const nx = -dy / len;
    const ny = dx / len;
    return [mx + nx * lift, my + ny * lift];
  };

  const pointOnCurve = (
    a: [number, number],
    c: [number, number],
    b: [number, number],
    t: number
  ): [number, number] => {
    const mt = 1 - t;
    return [
      mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0],
      mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1],
    ];
  };

  type ActiveEdge = { idx: number; t: number; speed: number };
  type Phase = "propagate" | "hold" | "fade";

  const HOLD_MS = 1400;
  const FADE_MS = 1000;

  let phase: Phase = "propagate";
  let phaseStart = 0;
  let raf = 0;
  let prevTime = 0;

  let activeEdges: ActiveEdge[] = [];
  let completed = new Set<number>();
  let started = new Set<number>();
  let activatedNodes = new Set<string>(["entry"]);
  let emittedFromNodes = new Set<string>(); // IMPORTANT: spawn outgoing exactly once per reached node

  const spawnFromNode = (node: string) => {
    if (emittedFromNodes.has(node)) return;
    emittedFromNodes.add(node);

    const next = outgoing.get(node) ?? [];
    next.forEach((edgeIdx) => {
      if (started.has(edgeIdx)) return;
      started.add(edgeIdx);
      activeEdges.push({
        idx: edgeIdx,
        t: 0,
        speed: 0.22 + (edgeIdx % 5) * 0.04, // t per second
      });
    });
  };

  const reset = () => {
    phase = "propagate";
    phaseStart = 0;
    activeEdges = [];
    completed = new Set();
    started = new Set();
    activatedNodes = new Set(["entry"]);
    emittedFromNodes = new Set();
    spawnFromNode("entry");
  };

  const drawPartialCurve = (
    a: [number, number],
    c: [number, number],
    b: [number, number],
    tEnd: number,
    alpha: number
  ) => {
    if (tEnd <= 0) return;
    const end = Math.max(0.001, Math.min(1, tEnd));
    const steps = Math.max(8, Math.ceil(72 * end));

    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * end;
      const [x, y] = pointOnCurve(a, c, b, t);
      ctx.lineTo(x, y);
    }

   ctx.strokeStyle = `rgba(190, 225, 255, ${alpha})`;
ctx.lineWidth = 2.2;
ctx.shadowBlur = 22;
    ctx.shadowColor = "rgba(120,190,255,0.9)";
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  reset();

  const draw = (time: number) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    const dt = prevTime ? (time - prevTime) / 1000 : 0;
    prevTime = time;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.55, 30, w * 0.5, h * 0.55, w * 0.55);
    bg.addColorStop(0, "rgba(95,170,255,0.12)");
    bg.addColorStop(0.45, "rgba(55,110,210,0.06)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const sx = w / MAP_BASE_W;
    const sy = h / MAP_BASE_H;
    const points = Object.fromEntries(
      Object.entries(rawPoints).map(([k, [x, y]]) => [k, [x * sx, y * sy]])
    ) as Record<string, [number, number]>;

    if (phase === "propagate") {
      const stillActive: ActiveEdge[] = [];

      for (const edge of activeEdges) {
        edge.t += edge.speed * dt;

        if (edge.t >= 1) {
          edge.t = 1;
          completed.add(edge.idx);
          const [, to] = links[edge.idx];
          if (!activatedNodes.has(to)) activatedNodes.add(to);
          spawnFromNode(to); // <- this is what makes it keep moving to next dots
        } else {
          stillActive.push(edge);
        }
      }

      activeEdges = stillActive;

      if (completed.size === links.length && activeEdges.length === 0) {
        phase = "hold";
        phaseStart = time;
      }
    } else if (phase === "hold") {
      if (time - phaseStart >= HOLD_MS) {
        phase = "fade";
        phaseStart = time;
      }
    } else if (phase === "fade") {
      if (time - phaseStart >= FADE_MS) {
        reset(); // <- full restart from beginning
      }
    }

    const fadeAlpha = phase === "fade" ? Math.max(0, 1 - (time - phaseStart) / FADE_MS) : 1;

    // Completed links
    completed.forEach((i) => {
      const [from, to] = links[i];
      const a = points[from];
      const b = points[to];
      const c = controlPoint(a, b);
      drawPartialCurve(a, c, b, 1, 0.75 * fadeAlpha);
    });

    // Growing links + moving head particles
    activeEdges.forEach(({ idx, t }) => {
      const [from, to] = links[idx];
      const a = points[from];
      const b = points[to];
      const c = controlPoint(a, b);

      drawPartialCurve(a, c, b, t, 0.65 * fadeAlpha);

      const [px, py] = pointOnCurve(a, c, b, t);

      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(130, 200, 255, ${0.22 * fadeAlpha})`;
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(130, 200, 255, 0.9)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, 3.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.98 * fadeAlpha})`;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(255,255,255,1)";
      ctx.fill();

      ctx.shadowBlur = 0;
    });

    // Dots always visible
    Object.values(points).forEach(([x, y], i) => {
      const pulse = 0.9 + Math.sin(time * 0.0045 + i * 0.85) * 0.3;

      ctx.beginPath();
      ctx.arc(x, y, 10.8 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(140,200,255,0.16)";
      ctx.shadowBlur = 16;
      ctx.shadowColor = "rgba(150,210,255,0.9)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(255,255,255,1)";
      ctx.fill();

      ctx.shadowBlur = 0;
    });

    raf = requestAnimationFrame(draw);
  };

  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}, []);
  return (
    <div className="w-full h-[503px] bg-black flex items-center justify-center overflow-hidden">
      <div
        className="relative overflow-hidden"
        style={{
          width: "849px",
          height: "503px",
          background:
            "radial-gradient(circle at 50% 58%, rgba(23,46,92,0.45) 0%, rgba(7,12,25,0.95) 55%, #000 100%)",
        }}
      >
        <img
          src="/map/map2.svg"
          alt="World map"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "92%",
            top: "4%",
            objectFit: "fill",
            opacity: 1,
            filter:
              "brightness(1.95) contrast(1.35) saturate(1.5) drop-shadow(0 0 22px rgba(120,190,255,0.35))",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            filter: "drop-shadow(0 0 18px rgba(170,220,255,0.35))",
          }}
        />
      </div>
    </div>
  );
}
