import { useRef, useEffect, useState } from 'react';

const W = 320;
const H = 240;
const LX = 112;
const LY = 133;

const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

function aperture(ctx, cx, cy, r, t) {
  const n = 8;
  const rot = (1 - t) * (Math.PI / n);
  const hole = Math.max(1.5, r * (0.08 + t * 0.64));
  const outer = r * 0.9;
  const hw = (Math.PI / n) * 0.92;
  ctx.strokeStyle = '#c49820';
  ctx.lineWidth = 0.85;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI + rot;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, a - hw, a + hw);
    ctx.lineTo(cx + Math.cos(a + hw) * hole, cy + Math.sin(a + hw) * hole);
    ctx.arc(cx, cy, hole, a + hw, a - hw, true);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, hole * 0.72, 0, Math.PI * 2);
  ctx.stroke();
}

function camera(ctx, aT) {
  const dark = document.body.classList.contains('dark');
  const ink  = dark ? 'rgba(245,240,232,0.85)' : 'rgba(28,24,20,0.85)';
  const dim  = dark ? 'rgba(245,240,232,0.40)' : 'rgba(28,24,20,0.45)';

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;

  // Body
  ctx.beginPath();
  ctx.strokeRect(38, 64, 252, 138);

  // Top hump (trapezoid)
  ctx.beginPath();
  ctx.moveTo(38, 64);
  ctx.lineTo(55, 42);
  ctx.lineTo(220, 42);
  ctx.lineTo(240, 64);
  ctx.stroke();

  // Lens rings
  const rings = [
    { r: 54, lw: 1.4 },
    { r: 47, lw: 1.1 },
    { r: 40, lw: 1.3 },
    { r: 32, lw: 1.0 },
    { r: 22, lw: 1.1 },
  ];
  rings.forEach(({ r, lw }) => {
    ctx.beginPath();
    ctx.arc(LX, LY, r, 0, Math.PI * 2);
    ctx.strokeStyle = ink;
    ctx.lineWidth = lw;
    ctx.stroke();
  });

  // Aperture blades
  aperture(ctx, LX, LY, 19, aT);

  // Index mark dot on lens
  ctx.beginPath();
  ctx.arc(LX + 54, LY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#c49820';
  ctx.fill();

  // Top plate
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.0;

  // Shutter button
  ctx.beginPath();
  ctx.arc(83, 42, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(83, 42, 4, 0, Math.PI * 2);
  ctx.strokeStyle = dim;
  ctx.stroke();

  // Exposure dial
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(194, 42, 16, 0, Math.PI * 2);
  ctx.stroke();
  // Dial tick marks
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = dim;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const inner = i % 3 === 0 ? 10 : 12;
    ctx.beginPath();
    ctx.moveTo(194 + Math.cos(a) * inner, 42 + Math.sin(a) * inner);
    ctx.lineTo(194 + Math.cos(a) * 16, 42 + Math.sin(a) * 16);
    ctx.stroke();
  }

  // Hot shoe
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.strokeRect(128, 37, 48, 6);

  // Viewfinder window
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(202, 74, 70, 44, 2);
  ctx.stroke();
  // Inner rangefinder frame (amber)
  ctx.strokeStyle = '#c49820';
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = 'rgba(196,152,32,0.55)';
  ctx.beginPath();
  ctx.strokeRect(212, 82, 50, 28);
  ctx.stroke();

  // AF assist lamp
  ctx.strokeStyle = ink;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(180, 101, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(180, 101, 2.5, 0, Math.PI * 2);
  ctx.strokeStyle = dim;
  ctx.stroke();

  // Strap lug left
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.strokeRect(32, 80, 8, 30);

  // Strap lug right
  ctx.beginPath();
  ctx.strokeRect(288, 80, 8, 30);

  // Speaker / sensor dots
  ctx.fillStyle = dim;
  [0, 1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.arc(280, 142 + i * 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Bottom panel line — drawn in two segments to skip the lens area
  // Lens at cx=112, cy=133, r=54 intersects y=178 at x≈82 and x≈142
  ctx.strokeStyle = dim;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(38, 178);
  ctx.lineTo(78, 178);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(146, 178);
  ctx.lineTo(290, 178);
  ctx.stroke();

  // Serial / label area — centered in right portion of lower panel (x=146–290)
  const labelX = (146 + 290) / 2; // 218
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c49820';
  ctx.font = "600 8px 'JetBrains Mono', monospace";
  ctx.letterSpacing = '2.5px';
  ctx.fillText('TANNER', labelX, 188);

  ctx.letterSpacing = '1px';
  ctx.font = "400 6.5px 'JetBrains Mono', monospace";
  ctx.fillStyle = 'rgba(196,152,32,0.70)';
  ctx.fillText('50mm  f/1.8', labelX, 197);
  ctx.letterSpacing = '0px';
}

const Camera = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ aT: 0.7, hovering: false, bAmt: 0, bPhase: 0, t0: null });
  const rafRef = useRef(null);
  const [tipShown, setTipShown] = useState(false);
  const tipRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * 2 * dpr;
    canvas.height = H * 2 * dpr;

    const ctx = canvas.getContext('2d');

    const draw = (ts) => {
      const s = stateRef.current;
      if (s.t0 === null) s.t0 = ts;
      const loadT = ease(Math.min(1, (ts - s.t0) / 1200));

      if (s.hovering) {
        s.bAmt = Math.min(1, s.bAmt + 0.05);
        s.bPhase += 0.028;
      } else {
        s.bAmt = Math.max(0, s.bAmt - 0.05);
      }
      const breathe = 1 + (Math.sin(s.bPhase) * 0.5 + 0.5) * 0.02 * s.bAmt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = loadT;
      ctx.scale(2 * dpr, 2 * dpr);
      ctx.translate((1 - loadT) * 60, 0);
      ctx.translate(W / 2, H / 2);
      ctx.scale(breathe, breathe);
      ctx.translate(-W / 2, -H / 2);
      camera(ctx, s.aT);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!tipRef.current) return;
      tipRef.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 12}px)`;
    };
    if (tipShown) window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [tipShown]);

  const onMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const dist = Math.hypot(x - LX, y - LY);
    stateRef.current.aT = Math.max(0.15, Math.min(1, 1 - dist / 120));
  };

  const onMouseEnter = () => {
    stateRef.current.hovering = true;
    setTipShown(true);
  };

  const onMouseLeave = () => {
    stateRef.current.hovering = false;
    stateRef.current.aT = 0.7;
    setTipShown(false);
  };

  const onClick = () => {
    const s = stateRef.current;
    const target = s.aT < 0.5 ? 1 : 0.15;
    const start = s.aT;
    const t0 = performance.now();
    const dur = 400;
    const snap = (ts) => {
      const p = Math.min(1, (ts - t0) / dur);
      s.aT = start + (target - start) * ease(p);
      if (p < 1) requestAnimationFrame(snap);
    };
    requestAnimationFrame(snap);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="camera-canvas"
        style={{ width: 560, height: 420, cursor: 'crosshair', display: 'block' }}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      <div
        ref={tipRef}
        className={`spec-tip ${tipShown ? 'shown' : ''}`}
        aria-hidden={!tipShown}
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <div className="spec-tip-head">specs ⟶ stack</div>
        <div className="spec-row"><span className="cam">f / 1.8</span><span className="arrow">→</span><span className="dev">depth over breadth</span></div>
        <div className="spec-row"><span className="cam">1/500s</span><span className="arrow">→</span><span className="dev">optimize for feedback loops</span></div>
        <div className="spec-row"><span className="cam">ISO 400</span><span className="arrow">→</span><span className="dev">embrace imperfect inputs</span></div>
        <div className="spec-row"><span className="cam">RAW</span><span className="arrow">→</span><span className="dev">systems built to evolve</span></div>
      </div>
    </>
  );
};

export default Camera;
