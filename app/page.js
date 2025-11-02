"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const FAKE_STEPS = [
  "Bootstrapping client runtime",
  "Spooling asset bundles",
  "Negotiating shard handshake",
  "Priming physics kernel",
  "Compiling UI layers",
  "Resolving social graph",
  "Streaming immersive textures",
  "Hydrating scene entities",
  "Enabling anti-lag field",
  "Calibrating haptic feedback",
  "Synchronizing avatar rig",
  "Encrypting voice channels",
  "Warping into experience",
];

function useProgress() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(FAKE_STEPS[0]);
  useEffect(() => {
    let pct = 0;
    let idx = 0;
    const timer = setInterval(() => {
      const step = Math.max(1, Math.floor(Math.random() * 4));
      pct = Math.min(100, pct + step);
      if (pct > ((idx + 1) * 100) / FAKE_STEPS.length && idx < FAKE_STEPS.length - 1) {
        idx += 1;
        setPhase(FAKE_STEPS[idx]);
      }
      setProgress(pct);
      if (pct >= 100) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);
  return { progress, phase };
}

function NeonParticles() {
  const canvasRef = useRef(null);
  const hueBase = useMemo(() => Math.floor(Math.random() * 360), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.5,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // soft grid glow background
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, "rgba(0, 10, 20, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        const hue = (hueBase + (p.x / width) * 120 + (p.y / height) * 120) % 360;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, 0.8)`;
        ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.9)`;
        ctx.shadowBlur = 12;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // connective filaments
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 85) {
            const alpha = 1 - dist / 85;
            ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${alpha * 0.25})`;
            ctx.lineWidth = alpha * 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });

      rafId = requestAnimationFrame(draw);
    }

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onResize);
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [hueBase]);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden />;
}

export default function Page() {
  const { progress, phase } = useProgress();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <main className="viewport">
      <NeonParticles />

      <div className="glass">
        <div className="brand">
          <div className="diamond" />
          <span className="wordmark">ARCANE</span>
        </div>

        <div className="status">
          <div className="phase">
            <span className="pulse" />
            <span>{phase}</span>
          </div>

          <div className="bar">
            <div className="fill" style={{ width: `${progress}%` }} />
            <div className="ticks">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>

          <div className="meta">
            <span>{String(progress).padStart(3, "0")}%</span>
            <span>Session #{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        <div className="console">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="line">
              <span className="tag">ok</span>
              <span>module[{i.toString().padStart(2, "0")}]: {FAKE_STEPS[(i * 3) % FAKE_STEPS.length]}</span>
              <span className="dots">................................</span>
              <span className="ret">{(Math.random() * 100).toFixed(2)}ms</span>
            </div>
          ))}
        </div>

        <button className={`cta ${done ? "ready" : ""}`} disabled={!done} onClick={() => window.location.reload()}>
          {done ? "Enter Experience" : "Preparing..."}
        </button>
      </div>

      <div className="sweep" />
      <div className="grain" />
    </main>
  );
}
