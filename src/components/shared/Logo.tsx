"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const ORBIT_POSITIONS = [
  { angle: 0, r: 90 }, { angle: 20, r: 110 }, { angle: 45, r: 75 },
  { angle: 70, r: 100 }, { angle: 90, r: 85 }, { angle: 110, r: 105 },
  { angle: 135, r: 78 }, { angle: 155, r: 95 }, { angle: 180, r: 88 },
  { angle: 200, r: 108 }, { angle: 225, r: 72 }, { angle: 250, r: 100 },
  { angle: 270, r: 83 }, { angle: 290, r: 102 }, { angle: 315, r: 76 },
  { angle: 340, r: 92 }, { angle: 30, r: 130 }, { angle: 80, r: 125 },
  { angle: 130, r: 128 }, { angle: 175, r: 122 }, { angle: 220, r: 132 },
  { angle: 265, r: 120 }, { angle: 310, r: 126 }, { angle: 355, r: 118 },
  { angle: 55, r: 58 }, { angle: 140, r: 60 }, { angle: 230, r: 55 },
  { angle: 320, r: 62 },
];

const COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#5b21b6"];

export function ByteCoderLogo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bitsRef = useRef<
    {
      el: HTMLSpanElement;
      orbit: { angle: number; r: number };
      phase: number;
      floatAmp: number;
      floatSpeed: number;
      spawnDelay: number;
      spawned: boolean;
      spawnTime: number | null;
      spawnX: number;
      spawnY: number;
    }[]
  >([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const bits = ORBIT_POSITIONS.map((orbit, i) => {
      const el = document.createElement("span");
      el.textContent = Math.random() > 0.5 ? "1" : "0";
      el.style.cssText = `
        position: absolute; pointer-events: none; opacity: 0;
        font-family: 'JetBrains Mono', monospace; font-weight: 900;
        color: ${COLORS[i % COLORS.length]};
      `;
      wrapper.appendChild(el);
      return {
        el,
        orbit,
        phase: Math.random() * Math.PI * 2,
        floatAmp: 3 + Math.random() * 5,
        floatSpeed: 0.4 + Math.random() * 0.6,
        spawnDelay: i * 80,
        spawned: false,
        spawnTime: null as number | null,
        spawnX: (Math.random() - 0.5) * 60,
        spawnY: (Math.random() - 0.5) * 20,
      };
    });

    bitsRef.current = bits;
    let startTime: number | null = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const cx = wrapper.offsetWidth / 2;
      const cy = wrapper.offsetHeight / 2;

      bits.forEach((b) => {
        if (elapsed < b.spawnDelay) return;
        if (!b.spawned) { b.spawned = true; b.spawnTime = ts; }

        const age = ts - b.spawnTime!;
        const eased = easeOutCubic(Math.min(age / 600, 1));
        const angleRad = (b.orbit.angle * Math.PI) / 180;
        const tx = cx + Math.cos(angleRad) * b.orbit.r;
        const ty = cy + Math.sin(angleRad) * b.orbit.r * 0.38;
        const sx = cx + b.spawnX;
        const sy = cy + b.spawnY;
        const floatY = Math.sin(ts * 0.001 * b.floatSpeed + b.phase) * b.floatAmp;
        const floatX = Math.cos(ts * 0.0007 * b.floatSpeed + b.phase) * b.floatAmp * 0.5;
        const x = sx + (tx - sx) * eased + floatX * eased;
        const y = sy + (ty - sy) * eased + floatY * eased;
        const opacity = eased * (0.55 + 0.45 * Math.sin(ts * 0.001 * b.floatSpeed + b.phase + 1));
        const scale = 0.6 + eased * 0.5;
        const fontSize = 0.65 + b.orbit.r * 0.004;

        b.el.style.left = `${x}px`;
        b.el.style.top = `${y}px`;
        b.el.style.opacity = String(opacity);
        b.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        b.el.style.fontSize = `${fontSize}rem`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bits.forEach((b) => b.el.remove());
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
    >
      <Link href="/" className="shrink-0" style={{ position: "relative", zIndex: 10 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontWeight: 900,
            fontSize: "1.5rem",
            letterSpacing: "-0.04em",
            background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          byter-code
        </span>
      </Link>
    </div>
  );
}