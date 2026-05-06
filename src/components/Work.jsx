import { useRef, useState, useEffect } from 'react';

export const useReveal = (opts = {}) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: opts.threshold ?? 0.18, rootMargin: opts.rootMargin ?? '0px 0px -10% 0px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
};

export const TiltCard = ({ children, accent = true, className = '' }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 10;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div ref={ref} className={`card${className ? ' ' + className : ''}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {accent && <div className="accent-line" />}
      {children}
    </div>
  );
};

const TravaShot = () => (
  <div className="shot" style={{
    background: `
      radial-gradient(ellipse at 70% 30%, color-mix(in oklab, var(--amber) 22%, transparent), transparent 55%),
      linear-gradient(180deg, #f9f4ea 0%, #ece3d0 100%)
    `,
    overflow: 'hidden',
  }}>
    <svg viewBox="0 0 800 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="grid-trava" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(15,14,12,0.06)" strokeWidth="1" />
        </pattern>
        <linearGradient id="route" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e8c46a" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#e8c46a" stopOpacity="1" />
          <stop offset="1" stopColor="#d4a847" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#grid-trava)" />
      <g stroke="rgba(15,14,12,0.18)" strokeWidth="1.5" fill="none">
        <path d="M0 120 L800 110" />
        <path d="M0 220 L800 215" />
        <path d="M0 340 L800 330" />
        <path d="M120 0 L130 500" />
        <path d="M280 0 L295 500" />
        <path d="M460 0 L475 500" />
        <path d="M640 0 L655 500" />
      </g>
      <path
        d="M70 380 Q 130 220 280 218 L 470 215 Q 540 215 600 110"
        fill="none" stroke="url(#route)" strokeWidth="6" strokeLinecap="round"
      />
      <circle cx="600" cy="110" r="9" fill="#e8c46a" stroke="#0f0e0c" strokeWidth="1.5" />
      <circle cx="600" cy="110" r="22" fill="none" stroke="#e8c46a" strokeOpacity="0.4" strokeWidth="1.5" />
      <g transform="translate(540 280)">
        <rect width="180" height="180" rx="24" fill="#0f0e0c" />
        <rect x="10" y="10" width="160" height="160" rx="16" fill="#1a1410" />
        <text x="90" y="40" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#e8c46a" letterSpacing="2">TRAVA</text>
        <path d="M30 130 Q 60 70 100 90 L 145 100" fill="none" stroke="#e8c46a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="145" cy="100" r="5" fill="#e8c46a" />
        <text x="90" y="158" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(245,240,232,0.55)" letterSpacing="1.5">12.4 MI · 47 STREETS</text>
      </g>
    </svg>
  </div>
);

const FolioShot = () => (
  <div className="shot" style={{
    background: 'linear-gradient(180deg, #0f0e0c 0%, #1a1410 100%)',
    overflow: 'hidden',
  }}>
    <svg viewBox="0 0 800 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bar1" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#e8c46a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#e8c46a" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="720" height="420" rx="10" fill="#241c16" stroke="rgba(232,196,106,0.12)" />
      <circle cx="62" cy="62" r="5" fill="#3a2e22" />
      <circle cx="78" cy="62" r="5" fill="#3a2e22" />
      <circle cx="94" cy="62" r="5" fill="#3a2e22" />
      <text x="400" y="66" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(245,240,232,0.4)" letterSpacing="2">folio · local · october</text>
      <text x="80" y="155" fontFamily="Playfair Display, serif" fontSize="48" fill="#f5f0e8" fontWeight="500">$3,184.20</text>
      <text x="80" y="180" fontFamily="DM Sans, sans-serif" fontSize="11" fill="rgba(245,240,232,0.45)" letterSpacing="2">SPENT THIS MONTH ↓ 14%</text>
      {[
        { x: 80,  h: 70,  label: 'food' },
        { x: 160, h: 130, label: 'rent' },
        { x: 240, h: 50,  label: 'gas'  },
        { x: 320, h: 95,  label: 'subs' },
        { x: 400, h: 35,  label: 'misc' },
        { x: 480, h: 110, label: 'bills' },
        { x: 560, h: 60,  label: 'fun'  },
        { x: 640, h: 80,  label: 'gear' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={400 - b.h} width="48" height={b.h} fill="url(#bar1)" rx="2" />
          <text x={b.x + 24} y="430" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(245,240,232,0.45)" letterSpacing="1">{b.label}</text>
        </g>
      ))}
      <line x1="80" y1="400" x2="710" y2="400" stroke="rgba(232,196,106,0.18)" strokeWidth="1" />
    </svg>
  </div>
);

const BrewingShot = () => (
  <div className="shot" style={{ background: 'linear-gradient(160deg, #13110e 0%, #1c1510 100%)', overflow: 'hidden' }}>
    <svg viewBox="0 0 800 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="grid-brew" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="rgba(245,240,232,0.03)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#grid-brew)" />

      {/* Saucer */}
      <ellipse cx="400" cy="368" rx="122" ry="18" fill="none" stroke="rgba(245,240,232,0.50)" strokeWidth="1.5" />
      <ellipse cx="400" cy="368" rx="96" ry="12" fill="none" stroke="rgba(245,240,232,0.18)" strokeWidth="1" />

      {/* Cup body */}
      <path d="M 308 202 L 492 202 L 468 355 L 332 355 Z" fill="none" stroke="rgba(245,240,232,0.60)" strokeWidth="1.8" strokeLinejoin="round" />

      {/* Cup rim */}
      <ellipse cx="400" cy="202" rx="92" ry="14" fill="none" stroke="rgba(245,240,232,0.55)" strokeWidth="1.5" />

      {/* Coffee surface */}
      <ellipse cx="400" cy="202" rx="84" ry="10" fill="rgba(232,196,106,0.10)" stroke="rgba(232,196,106,0.38)" strokeWidth="1" />

      {/* Handle */}
      <path d="M 467 242 C 538 242 538 318 467 338" fill="none" stroke="rgba(245,240,232,0.55)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Latte art (subtle) */}
      <ellipse cx="400" cy="202" rx="46" ry="6" fill="none" stroke="rgba(232,196,106,0.22)" strokeWidth="1" transform="rotate(-12, 400, 202)" />

      {/* Steam lines */}
      <path className="steam-line" style={{ animationDelay: '0s' }}
        d="M 362 190 Q 347 165 364 142 Q 381 119 364 94"
        fill="none" stroke="#e8c46a" strokeWidth="1.8" strokeLinecap="round" />
      <path className="steam-line" style={{ animationDelay: '0.9s' }}
        d="M 400 188 Q 385 158 402 128 Q 419 98 402 68"
        fill="none" stroke="#e8c46a" strokeWidth="1.8" strokeLinecap="round" />
      <path className="steam-line" style={{ animationDelay: '1.8s' }}
        d="M 438 190 Q 453 165 436 142 Q 419 119 436 94"
        fill="none" stroke="#e8c46a" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const Work = () => {
  const [headRef, headIn] = useReveal();
  const [c1Ref, c1In] = useReveal();
  const [c2Ref, c2In] = useReveal({ rootMargin: '0px 0px -5% 0px' });
  const [c3Ref, c3In] = useReveal({ rootMargin: '0px 0px -5% 0px' });

  return (
    <section id="work" data-screen-label="02 Work">
      <div ref={headRef} className={`section-head reveal ${headIn ? 'in' : ''}`}>
        <h2>selected work</h2>
        <span className="label">2024 — 2026</span>
      </div>

      <div className="work-grid">
        <div ref={c1Ref} className={`reveal ${c1In ? 'in' : ''}`}>
          <TiltCard>
            <TravaShot />
            <div className="card-meta">
              <div className="card-row">
                <h3>Trava</h3>
                <span className="card-num">01 / 02</span>
              </div>
              <div className="stack">
                <span>Swift</span><span>SwiftUI</span><span>MapKit</span><span>CoreLocation</span><span>SwiftData</span>
              </div>
              <p className="card-desc">
                An iOS app that turns your walks into a living map. GPS tracks every street you cover, painting your city one step at a time.
              </p>
              <a href="https://github.com/thelensguy/trava-ios" className="card-link">
                view project
                <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </TiltCard>
        </div>

        <div ref={c2Ref} className={`reveal ${c2In ? 'in' : ''}`}>
          <TiltCard>
            <FolioShot />
            <div className="card-meta">
              <div className="card-row">
                <h3>Folio</h3>
                <span className="card-num">02 / 02</span>
              </div>
              <div className="stack">
                <span>Next.js 14</span><span>SQLite</span><span>Drizzle</span><span>Recharts</span><span>Zustand</span><span>shadcn/ui</span>
              </div>
              <p className="card-desc">
                A local-first finance dashboard that imports Chase transactions and visualizes spending by category and merchant. No accounts, no cloud, just your data.
              </p>
              <a href="https://github.com/thelensguy/folio" className="card-link">
                view project
                <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </TiltCard>
        </div>

        {/* <div ref={c3Ref} className={`reveal ${c3In ? 'in' : ''}`}>
          <TiltCard accent={false} className="card-brewing">
            <BrewingShot />
            <div className="card-meta">
              <div className="card-row">
                <h3>brewing something new</h3>
                <span className="card-num">03 / 03</span>
              </div>
              <p className="card-brewing-sub">next project · coming soon</p>
            </div>
          </TiltCard>
        </div> */}
      </div>
    </section>
  );
};

export default Work;
