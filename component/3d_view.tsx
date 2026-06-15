"use client";

import { useEffect, useRef } from "react";

export default function Map3DEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAP_BASE_W = 848.9999389648438;
    const MAP_BASE_H = 503.4253234863281;
    let raf = 0;

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

    const controlPoint = (
      a: [number, number],
      b: [number, number]
    ): [number, number] => {
      const [x1, y1] = a;
      const [x2, y2] = b;

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;

      const lift = Math.min(60, len * 0.25);
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

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      if (
        canvas.width !== Math.floor(w * dpr) ||
        canvas.height !== Math.floor(h * dpr)
      ) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const sx = w / MAP_BASE_W;
      const sy = h / MAP_BASE_H;

      const points = Object.fromEntries(
        Object.entries(rawPoints).map(([key, [x, y]]) => [
          key,
          [x * sx, y * sy],
        ])
      ) as Record<string, [number, number]>;

      links.forEach(([from, to], i) => {
        const a = points[from];
        const b = points[to];
        const c = controlPoint(a, b);

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]);
        ctx.strokeStyle = "rgba(188,215,255,0.42)";
        ctx.lineWidth = 1.3;
        ctx.shadowBlur = 9;
        ctx.shadowColor = "rgba(170,210,255,0.65)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        const speed = 0.00013 + (i % 3) * 0.00005;
        const t = ((time * speed + i * 0.17) % 1 + 1) % 1;
        const [px, py] = pointOnCurve(a, c, b, t);

        const pulse = 0.75 + Math.sin(time * 0.006 + i) * 0.25;

        ctx.beginPath();
        ctx.arc(px, py, 4.2 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.shadowBlur = 16;
        ctx.shadowColor = "rgba(255,255,255,1)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      Object.values(points).forEach(([x, y], i) => {
        const pulse = 0.9 + Math.sin(time * 0.005 + i * 0.9) * 0.35;

        ctx.beginPath();
        ctx.arc(x, y, 10.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 4.8, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#fff";
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
  background: "#000",
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
            filter: "brightness(1.9) contrast(1.35) saturate(1.45)",
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
            filter: "none",
          }}
        />
      </div>
    </div>
  );
}