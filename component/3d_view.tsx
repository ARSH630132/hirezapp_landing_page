"use client";

import { useEffect, useRef } from "react";

export default function ThreeDView() {
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 900;
    const height = 520;

    canvas.width = width;
    canvas.height = height;

    const points: [number, number][] = [
      [20, 175], [80, 145], [140, 145], [190, 165], [245, 120], [305, 150],
      [370, 115], [430, 130], [485, 105], [550, 120], [615, 105], [680, 115],
      [740, 105], [810, 120], [880, 135],

      [55, 210], [110, 230], [165, 215], [225, 250], [280, 225], [340, 245],
      [400, 230], [455, 255], [510, 230], [570, 255], [630, 240], [690, 265],
      [750, 235], [820, 255],

      [90, 285], [135, 330], [185, 360], [230, 405], [280, 430],
      [365, 315], [420, 350], [470, 390], [520, 335], [575, 365],
      [635, 325], [695, 355], [760, 390], [825, 420],

      [210, 470], [235, 500], [480, 455], [530, 495], [700, 470], [800, 470],
    ];

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      const connected = points
        .map((p, j) => {
          const dx = points[i][0] - p[0];
          const dy = points[i][1] - p[1];

          return {
            j,
            d: Math.sqrt(dx * dx + dy * dy),
          };
        })
        .filter((item) => item.j !== i && item.d < 155)
        .sort((a, b) => a.d - b.d)
        .slice(0, 5);

      connected.forEach(({ j, d }) => {
        if (j < i) return;

        const [x1, y1] = points[i];
        const [x2, y2] = points[j];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255,255,255,${0.75 - d / 280})`;
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.stroke();

        ctx.shadowBlur = 0;
      });
    }

    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.shadowBlur = 22;
      ctx.shadowColor = "rgba(255,255,255,1)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ffffff";
      ctx.fill();

      ctx.shadowBlur = 0;
    });
  }, []);

  return (
    <div className="w-full h-[430px] bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[900px] h-[430px]">
        <img
          src="/map/map1.png"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-contain scale-[1.02] drop-shadow-[0_0_45px_rgba(255,255,255,0.20)]"
        />

        <canvas
          ref={mapCanvasRef}
          className="absolute inset-0 w-full h-full scale-[1.02] [transform:translateY(-18px)] drop-shadow-[0_0_16px_rgba(255,255,255,0.75)]"
        />
      </div>
    </div>
  );
}
