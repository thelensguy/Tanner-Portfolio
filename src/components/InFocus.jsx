import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReveal } from './Work.jsx';
import headshot from '../assets/headshot.jpg';

const DIAL_SIZE = 120;
const CX = 60, CY = 60;
const HOVER_ANGLE = (2 * Math.PI) / 5; // 72 degrees — one value increment

function drawDial(ctx, angle, values, activeIndex) {
  const dark   = document.body.classList.contains('dark');
  const ink    = dark ? 'rgba(245,240,232,0.85)' : 'rgba(28,24,20,0.85)';
  const faint  = dark ? 'rgba(245,240,232,0.20)' : 'rgba(28,24,20,0.20)';
  const inkMid = dark ? 'rgba(245,240,232,0.50)' : 'rgba(28,24,20,0.50)';
  const amber  = '#e8c46a';

  // --- Rotating dial body ---
  ctx.save();
  ctx.translate(CX, CY);
  ctx.rotate(angle);
  ctx.translate(-CX, -CY);

  // Grip tick marks: 60 ticks between r=46 and r=54
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isLong = i % 5 === 0;
    const len = isLong ? 8 : 4;
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(a) * 54, CY + Math.sin(a) * 54);
    ctx.lineTo(CX + Math.cos(a) * (54 - len), CY + Math.sin(a) * (54 - len));
    ctx.strokeStyle = isLong ? ink : faint;
    ctx.lineWidth   = isLong ? 1.0 : 0.55;
    ctx.stroke();
  }

  // Mid ring at r=42
  ctx.beginPath();
  ctx.arc(CX, CY, 42, 0, Math.PI * 2);
  ctx.strokeStyle = faint;
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Value labels at r=31
  const step = (2 * Math.PI) / values.length;
  for (let i = 0; i < values.length; i++) {
    const a  = -Math.PI / 2 + (i - activeIndex) * step;
    const lx = CX + Math.cos(a) * 31;
    const ly = CY + Math.sin(a) * 31;
    const isActive = i === activeIndex;
    ctx.font      = isActive ? "600 11px 'JetBrains Mono',monospace" : "400 9px 'JetBrains Mono',monospace";
    ctx.fillStyle = isActive ? amber : inkMid;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(values[i], lx, ly);
  }

  // Inner accent ring at r=20 (faint amber)
  ctx.beginPath();
  ctx.arc(CX, CY, 20, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(232,196,106,0.35)';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Center: amber stroke circle r=4
  ctx.beginPath();
  ctx.arc(CX, CY, 4, 0, Math.PI * 2);
  ctx.strokeStyle = amber;
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Center: filled amber dot r=2
  ctx.beginPath();
  ctx.arc(CX, CY, 2, 0, Math.PI * 2);
  ctx.fillStyle = amber;
  ctx.fill();

  ctx.restore();

  // --- Fixed elements (drawn over rotating body) ---

  // Outer ring at r=54
  ctx.beginPath();
  ctx.arc(CX, CY, 54, 0, Math.PI * 2);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Detent triangle: fixed, pointing down at top center
  ctx.beginPath();
  ctx.moveTo(CX,     CY - 54);   // tip touches outer ring top
  ctx.lineTo(CX - 4, CY - 59);   // top-left corner
  ctx.lineTo(CX + 4, CY - 59);   // top-right corner
  ctx.closePath();
  ctx.fillStyle = amber;
  ctx.fill();
}

const ExposureDial = ({ values, activeIndex, dialValue, dialDesc }) => {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ angle: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = DIAL_SIZE * dpr;
    canvas.height = DIAL_SIZE * dpr;
    const ctx = canvas.getContext('2d');
    let rafId;

    const loop = () => {
      const s = stateRef.current;
      s.angle += (s.target - s.angle) * 0.10;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      drawDial(ctx, s.angle, values, activeIndex);
      ctx.restore();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="resume-dial-col"
      onMouseEnter={() => { stateRef.current.target = HOVER_ANGLE; }}
      onMouseLeave={() => { stateRef.current.target = 0; }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: DIAL_SIZE, height: DIAL_SIZE, display: 'block' }}
      />
      <div className="dial-setting">{dialValue}</div>
      <div className="dial-desc">{dialDesc}</div>
    </div>
  );
};

// ── Basketball easter egg ─────────────────────────────────────────────────────

const BballSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#E8642A" stroke="rgba(15,14,12,0.35)" strokeWidth="0.8"/>
    <path d="M12 1 C7.5 6 7.5 18 12 23" fill="none" stroke="rgba(15,14,12,0.45)" strokeWidth="0.9"/>
    <path d="M12 1 C16.5 6 16.5 18 12 23" fill="none" stroke="rgba(15,14,12,0.45)" strokeWidth="0.9"/>
    <path d="M1 12 C6 8.5 18 8.5 23 12" fill="none" stroke="rgba(15,14,12,0.45)" strokeWidth="0.9"/>
  </svg>
);

const HoopSVG = ({ jiggle }) => (
  <svg width="54" height="58" viewBox="0 0 54 58">
    {/* Backboard */}
    <rect x="43" y="0" width="11" height="38" rx="1" fill="rgba(245,240,232,0.95)" stroke="rgba(15,14,12,0.85)" strokeWidth="1.2"/>
    <rect x="45" y="8" width="7" height="10" rx="0.5" fill="none" stroke="#e8c46a" strokeWidth="1"/>
    {/* Bracket arm */}
    <line x1="43" y1="24" x2="36" y2="24" stroke="rgba(15,14,12,0.85)" strokeWidth="1.5"/>
    {/* Rim */}
    <rect x="3" y="21" width="35" height="5" rx="2" fill="none" stroke="rgba(15,14,12,0.85)" strokeWidth="2"/>
    {/* Net — jiggle targets this group */}
    <g
      className={jiggle ? 'bball-net-jiggle' : ''}
      style={{ transformOrigin: '20px 26px' }}
    >
      <line x1="6"  y1="26" x2="8"  y2="45" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <line x1="12" y1="26" x2="13" y2="45" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <line x1="18" y1="26" x2="18" y2="45" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <line x1="24" y1="26" x2="23" y2="45" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <line x1="30" y1="26" x2="28" y2="45" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <path d="M8 45 C10 48 11 48 13 45"  fill="none" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <path d="M13 45 C15 48 16 48 18 45" fill="none" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <path d="M18 45 C20 48 21 48 23 45" fill="none" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
      <path d="M23 45 C25 48 27 48 28 45" fill="none" stroke="rgba(15,14,12,0.5)" strokeWidth="0.9"/>
    </g>
  </svg>
);

const BballShot = ({ wordRef, onDone }) => {
  const ballRef   = useRef(null);
  const [jiggle,  setJiggle]  = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Rim center within the HoopSVG: x=20.5, y=23.5
  const hoopLeft = window.innerWidth  - 74;
  const hoopTop  = Math.min(window.innerHeight * 0.28, window.innerHeight - 80);
  const ballEndX = hoopLeft + 20 - 12;  // rim center minus ball radius
  const ballEndY = hoopTop  + 23 - 12;

  const wordRect  = wordRef.current.getBoundingClientRect();
  const ballStartX = wordRect.left + wordRect.width  / 2 - 12;
  const ballStartY = wordRect.top  + wordRect.height / 2 - 12;

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    const dx = ballEndX - ballStartX;
    const dy = ballEndY - ballStartY;
    // Parabola peaking at t=0.38 (slightly before midpoint, like a real free-throw)
    // Solving: a*(0.38)^2 + b*0.38 = -peakLift, a + b = dy
    const peakLift = Math.min(175, window.innerHeight * 0.22);
    const tp = 0.38;
    const a  = (peakLift + tp * dy) / (tp - tp * tp);  // parabola peak at t=tp above start
    const b  = dy - a;

    const steps = 50;
    const kf = Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      return {
        transform: `translate(${dx * t}px, ${a * t * t + b * t}px) rotate(${t * 390}deg)`,
      };
    });

    const anim = ball.animate(kf, { duration: 720, easing: 'linear', fill: 'forwards' });

    anim.onfinish = () => {
      setJiggle(true);                              // net reacts
      setTimeout(() => setFadeOut(true), 180);      // start fade
      setTimeout(onDone, 520);                      // total ≈ 1240ms
    };

    return () => anim.cancel();
  }, []);

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: 'none',
      opacity: fadeOut ? 0 : 1,
      transition: fadeOut ? 'opacity 0.34s ease-in' : 'none',
    }}>
      {/* Ball */}
      <div ref={ballRef} style={{
        position: 'absolute',
        left: ballStartX, top: ballStartY,
        transformOrigin: '12px 12px',
        willChange: 'transform',
      }}>
        <BballSVG />
      </div>
      {/* Hoop */}
      <div style={{ position: 'absolute', left: hoopLeft, top: hoopTop }}>
        <HoopSVG jiggle={jiggle} />
      </div>
    </div>,
    document.body
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    co: 'Level Up', role: 'Technical Program Manager', date: 'May 2025 — Present',
    values: ['-2', '-1', '0', '+1', '+2'], activeIndex: 2,
    dialValue: 'ISO 100', dialDesc: 'clear · human',
    bullets: [
      'Lead career development workshops and mentorship programs for 100+ university students across technology and professional skills',
      'Design and deliver training curricula focused on global workplace readiness, English communication, and software fundamentals',
    ],
  },
  {
    co: 'WebConnex', role: 'Software Engineer', date: 'Sep 2021 — May 2025',
    values: ['A', '1.4', '1.8', '2.8', '4'], activeIndex: 2,
    dialValue: 'f / 1.8', dialDesc: 'deep focus',
    bullets: [
      'Migrated a legacy Angular codebase to React, modernizing the frontend stack and improving performance across billing, mobile, and core platforms',
      'Built reusable component libraries and implemented alerting systems that measurably increased platform reliability',
    ],
  },
  {
    co: "Sam's Club", role: 'Backend Engineer', date: 'Jun — Oct 2020',
    values: ['B', '60', '125', '500', '1000'], activeIndex: 3,
    dialValue: '1/500s', dialDesc: 'fast · precise',
    bullets: [
      'Built automated test suites ensuring data integrity across a catalog system with 10M+ products',
      'Developed an internal product lookup tool in Next.js that reduced issue resolution time from hours to minutes — supported Black Friday and Cyber Monday',
    ],
  },
];

const InFocus = () => {
  const [headRef, headIn] = useReveal();
  const [bodyRef, bodyIn] = useReveal();
  const [skillsRef, skillsIn] = useReveal();
  const [resumeRef, resumeIn] = useReveal({ rootMargin: '0px 0px -5% 0px' });
  const [shooting, setShooting] = useState(false);
  const wordRef = useRef(null);

  return (
    <section id="focus" data-screen-label="03 In Focus">
      <div ref={headRef} className={`section-head reveal ${headIn ? 'in' : ''}`}>
        <h2>in focus</h2>
        <span className="label">about</span>
      </div>

      <div ref={bodyRef} className={`focus-grid reveal ${bodyIn ? 'in' : ''}`}>
        <div className="portrait" data-cursor="pill">
          <img
            src={headshot}
            alt="Tanner"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        </div>
        <div className="focus-text">
          <p className="lead">
            I'm Tanner — a software engineer who obsesses over the details between
            design and code. I care deeply about software that feels alive.
          </p>
          <div className="focus-divider" />
          <div className="strip">
            making coffee i'm proud of<span className="dot"></span><span
              ref={wordRef}
              className="bball-word"
              onClick={() => { if (!shooting) setShooting(true); }}
            >basketball</span><span className="dot"></span>thelensguy
          </div>
          <div ref={skillsRef} className={`reveal ${skillsIn ? 'in' : ''}`} style={{ marginTop: 20 }}>
            <span className="label">stack</span>
            <div className="skill-tags">
              {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git'].map(s => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={resumeRef} className={`resume reveal ${resumeIn ? 'in' : ''}`}>
        {ROLES.map((r, i) => (
          <div className="resume-row" key={i} data-cursor="pill">
            <div className="resume-row-left">
              <div className="resume-row-header">
                <div className="co">{r.co}</div>
                <div className="role">{r.role}</div>
                <div className="date">{r.date}</div>
              </div>
              <ul className="resume-bullets">
                {r.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
            <ExposureDial
              values={r.values}
              activeIndex={r.activeIndex}
              dialValue={r.dialValue}
              dialDesc={r.dialDesc}
            />
          </div>
        ))}
      </div>
      {shooting && <BballShot wordRef={wordRef} onDone={() => setShooting(false)} />}
    </section>
  );
};

export default InFocus;
