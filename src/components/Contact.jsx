import { useState, useEffect } from 'react';
import { useReveal } from './Work.jsx';

const LattePour = ({ x, y, onRemove }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1200);
    const t2 = setTimeout(onRemove, 1480);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dark = document.body.classList.contains('dark');
  const ink      = dark ? 'rgba(245,240,232,0.85)' : 'rgba(28,24,20,0.85)';
  const inkFaint = dark ? 'rgba(245,240,232,0.35)' : 'rgba(28,24,20,0.35)';

  return (
    <div
      className={`latte-pour${fading ? ' fading' : ''}`}
      style={{ left: x - 26, top: y - 16 }}
    >
      <svg viewBox="0 0 52 70" width="52" height="70" overflow="visible">
        {/* Pour stream: amber line draws from top down to cup rim */}
        <path
          className="lp-stream"
          d="M 26 4 Q 29 18 26 33"
          fill="none" stroke="#c49820" strokeWidth="1.5" strokeLinecap="round"
        />

        {/* Cup body */}
        <path
          d="M 12 35 L 40 35 L 37 55 L 15 55 Z"
          fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round"
        />

        {/* Rim ellipse */}
        <ellipse cx="26" cy="35" rx="14" ry="4.5"
          fill="none" stroke={ink} strokeWidth="1.4" />

        {/* Saucer */}
        <ellipse cx="26" cy="57" rx="15" ry="4.5"
          fill="none" stroke={inkFaint} strokeWidth="1.2" />
        <ellipse cx="26" cy="57" rx="10" ry="2.8"
          fill="none" stroke={inkFaint} strokeWidth="0.7" />

        {/* Coffee surface */}
        <ellipse cx="26" cy="35" rx="12" ry="3.5"
          fill="rgba(196,152,32,0.13)" stroke="rgba(196,152,32,0.45)" strokeWidth="0.9" />

        {/* Latte art heart — drawn via stroke-dashoffset */}
        <path
          className="lp-art"
          d="M 26 38 C 21 35,17 32,18 29 C 19 26,23 26,26 30 C 29 26,33 26,34 29 C 35 32,31 35,26 38"
          fill="none" stroke="rgba(196,152,32,0.88)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Contact = () => {
  const [headRef, headIn] = useReveal();
  const [emailRef, emailIn] = useReveal();
  const [btnsRef, btnsIn] = useReveal();
  const [pours, setPours] = useState([]);

  const spark = (e) => {
    const id = Date.now() + Math.random();
    setPours(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
  };

  const removePour = (id) => setPours(prev => prev.filter(p => p.id !== id));

  return (
    <>
      {pours.map(p => (
        <LattePour key={p.id} x={p.x} y={p.y} onRemove={() => removePour(p.id)} />
      ))}

      <section id="contact" className="contact" data-screen-label="04 Contact">
        <div ref={headRef} className={`reveal ${headIn ? 'in' : ''}`}>
          <span className="label" style={{ display: 'block', marginBottom: 20 }}>contact</span>
          <span className="availability-badge">
            <span className="availability-dot" />
            open to new roles
          </span>
          <h2 style={{ marginTop: 28 }}>let's build <em>something.</em></h2>
        </div>

        <div ref={emailRef} className={`reveal ${emailIn ? 'in' : ''}`}>
          <a className="email-link" href="mailto:tanner.nguyenvu@gmail.com" onClick={spark}>
            tanner.nguyenvu@gmail.com
          </a>
        </div>

        <div ref={btnsRef} className={`contact-buttons reveal ${btnsIn ? 'in' : ''}`}>
          <a className="btn btn-ghost" href="https://github.com/thelensguy" target="_blank" rel="noreferrer" onClick={spark} aria-label="View GitHub profile">
            github.com/<span className="thelens-handle" data-tooltip="Tanner Nguyenvu">thelensguy</span>
            <svg className="arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="btn btn-ghost" href="https://www.linkedin.com/in/thelensguy" target="_blank" rel="noreferrer" onClick={spark} aria-label="View LinkedIn profile">
            linkedin.com/in/<span className="thelens-handle" data-tooltip="Tanner Nguyenvu">thelensguy</span>
            <svg className="arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="btn btn-ghost" href="/resume.pdf" download="Tanner_Nguyenvu_Resume.pdf" aria-label="Download resume PDF">
            resume ↓
          </a>
        </div>
      </section>

      <footer>
        <div className="left">© 2026 · all light, no shutter</div>
        <div className="sig">— tan.</div>
      </footer>
    </>
  );
};

export default Contact;
