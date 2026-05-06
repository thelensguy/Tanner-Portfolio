import { useRef, useState, useEffect } from 'react';

const Lens = ({ paused }) => {
  const wrapRef = useRef(null);
  const tipRef = useRef(null);
  const [tipShown, setTipShown] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!tipRef.current) return;
      tipRef.current.style.transform =
        `translate(${e.clientX + 18}px, ${e.clientY + 12}px)`;
    };
    if (tipShown) window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [tipShown]);

  const enter = () => setTipShown(true);
  const leave = () => setTipShown(false);

  return (
    <>
      <div
        ref={wrapRef}
        className="lens-wrap"
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <div className="lens-glow" aria-hidden="true" />

        <svg
          viewBox="0 0 600 280"
          className="lens-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="glass" cx="0.4" cy="0.38" r="0.7">
              <stop offset="0"    stopColor="#7fb8c9" />
              <stop offset="0.35" stopColor="#2a5a6e" />
              <stop offset="0.75" stopColor="#0f2a36" />
              <stop offset="1"    stopColor="#06141b" />
            </radialGradient>
            <radialGradient id="catchlight" cx="0.32" cy="0.28" r="0.22">
              <stop offset="0"   stopColor="rgba(255,255,255,0.9)" />
              <stop offset="0.6" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="1"   stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0"    stopColor="rgba(255,255,255,0)" />
              <stop offset="0.45" stopColor="rgba(255,255,255,0)" />
              <stop offset="0.5"  stopColor="rgba(232,196,106,0.5)" />
              <stop offset="0.55" stopColor="rgba(255,255,255,0)" />
              <stop offset="1"    stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <clipPath id="glassClip">
              <circle cx="160" cy="140" r="84" />
            </clipPath>
            <linearGradient id="barrel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#1a1612" />
              <stop offset="0.18" stopColor="#0f0e0c" />
              <stop offset="0.5"  stopColor="#1c1814" />
              <stop offset="0.85" stopColor="#0a0908" />
              <stop offset="1"    stopColor="#15110d" />
            </linearGradient>
            <linearGradient id="barrelNarrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   stopColor="#181410" />
              <stop offset="0.5" stopColor="#0c0b0a" />
              <stop offset="1"   stopColor="#100e0c" />
            </linearGradient>
          </defs>

          <g className="lens-group">
            {/* Mount end */}
            <g>
              <rect x="478" y="116" width="42" height="48" fill="url(#barrelNarrow)" />
              <circle cx="498" cy="120" r="2.4" fill="#e8c46a" opacity="0.85" />
              <line x1="478" y1="116.5" x2="520" y2="116.5" stroke="#e8c46a" strokeOpacity="0.35" strokeWidth="0.6" />
              <line x1="478" y1="163.5" x2="520" y2="163.5" stroke="#e8c46a" strokeOpacity="0.18" strokeWidth="0.5" />
              <rect x="518" y="110" width="8" height="60" fill="#0a0908" />
              <line x1="518" y1="110.5" x2="526" y2="110.5" stroke="#e8c46a" strokeOpacity="0.45" strokeWidth="0.6" />
            </g>

            {/* Aperture ring */}
            <g>
              <rect x="380" y="100" width="98" height="80" fill="url(#barrelNarrow)" />
              <line x1="380" y1="100" x2="380" y2="180" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="0.8" />
              <line x1="478" y1="100" x2="478" y2="180" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="0.8" />
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={i}
                  x1={388 + i * 5.6} y1="118"
                  x2={388 + i * 5.6} y2="162"
                  stroke="rgba(232,196,106,0.10)" strokeWidth="0.6"
                />
              ))}
              <line x1="380" y1="100.5" x2="478" y2="100.5" stroke="#e8c46a" strokeOpacity="0.42" strokeWidth="0.7" />
              <line x1="380" y1="179.5" x2="478" y2="179.5" stroke="#e8c46a" strokeOpacity="0.18" strokeWidth="0.6" />
              <text
                x="429" y="208"
                textAnchor="middle"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
                fontSize="11" letterSpacing="2"
                fill="#e8c46a" fillOpacity="0.92"
              >f / 1.8</text>
              <circle cx="429" cy="94" r="1.8" fill="#e8c46a" />
            </g>

            {/* Main focus barrel */}
            <g>
              <rect x="240" y="84" width="140" height="112" fill="url(#barrel)" />
              <line x1="240" y1="84" x2="240" y2="196" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="0.9" />
              <line x1="380" y1="84" x2="380" y2="196" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="0.9" />
              <line x1="240" y1="84.5" x2="380" y2="84.5" stroke="#e8c46a" strokeOpacity="0.45" strokeWidth="0.8" />
              <line x1="240" y1="195.5" x2="380" y2="195.5" stroke="#e8c46a" strokeOpacity="0.18" strokeWidth="0.6" />
              {Array.from({ length: 28 }).map((_, i) => (
                <line
                  key={i}
                  x1={246 + i * 4.7} y1="108"
                  x2={246 + i * 4.7} y2="172"
                  stroke="rgba(232,196,106,0.13)" strokeWidth="0.65"
                />
              ))}
              <text
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
                fontSize="10" letterSpacing="0.5"
                fill="#e8c46a" fillOpacity="0.95"
              >
                <tspan x="252" y="100">∞</tspan>
                <tspan x="282" y="100">2</tspan>
                <tspan x="310" y="100">1.2</tspan>
                <tspan x="342" y="100">0.9</tspan>
                <tspan x="368" y="100">0.7</tspan>
              </text>
              <path d="M310 105 L313 110 L307 110 Z" fill="#e8c46a" opacity="0.75" />
            </g>

            {/* Hood / front bezel */}
            <g>
              <rect x="222" y="76" width="22" height="128" fill="url(#barrelNarrow)" />
              <line x1="222" y1="76.5" x2="244" y2="76.5" stroke="#e8c46a" strokeOpacity="0.45" strokeWidth="0.7" />
              <line x1="222" y1="203.5" x2="244" y2="203.5" stroke="#e8c46a" strokeOpacity="0.20" strokeWidth="0.6" />
            </g>

            {/* Front glass element */}
            <g>
              <circle cx="160" cy="140" r="88" fill="#08070a" />
              <circle cx="160" cy="140" r="86" fill="none" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="0.9" />
              <circle cx="160" cy="140" r="82" fill="url(#glass)" />
              <circle cx="160" cy="140" r="80" fill="none" stroke="#e8c46a" strokeOpacity="0.42" strokeWidth="0.6" />
              <circle cx="160" cy="140" r="76" fill="none" stroke="rgba(127,184,201,0.35)" strokeWidth="0.5" />
              <g clipPath="url(#glassClip)">
                <rect
                  className="lens-shimmer"
                  x="60" y="50" width="60" height="200"
                  fill="url(#shimmer)"
                />
              </g>
              <ellipse cx="135" cy="115" rx="34" ry="22" fill="url(#catchlight)" />
              <circle cx="178" cy="160" r="3.5" fill="rgba(255,255,255,0.6)" />
            </g>

            <text
              x="310" y="190"
              textAnchor="middle"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize="7.5" letterSpacing="3"
              fill="#e8c46a" fillOpacity="0.55"
            >TANNER · 50mm</text>
          </g>
        </svg>
      </div>

      <div
        ref={tipRef}
        className={`spec-tip ${tipShown ? 'shown' : ''}`}
        aria-hidden={!tipShown}
      >
        <div className="spec-tip-head">specs ⟶ stack</div>
        <div className="spec-row"><span className="cam">f / 1.8</span><span className="arrow">→</span><span className="dev">full-stack</span></div>
        <div className="spec-row"><span className="cam">1/500s</span><span className="arrow">→</span><span className="dev">2 min deploy</span></div>
        <div className="spec-row"><span className="cam">ISO 400</span><span className="arrow">→</span><span className="dev">94% coverage</span></div>
        <div className="spec-row"><span className="cam">RAW</span><span className="arrow">→</span><span className="dev">TypeScript</span></div>
      </div>
    </>
  );
};

export default Lens;
