import { useRef, useEffect } from 'react';
import Camera from './Camera.jsx';

const Hero = ({ kineticStrength = 1 }) => {
  const headRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      tx = (e.clientX / w - 0.5) * 2;
      ty = (e.clientY / h - 0.5) * 2;
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (headRef.current) {
        const k = kineticStrength;
        const skX = cx * 1.2 * k;
        const skY = -cy * 0.8 * k;
        const tX = cx * 6 * k;
        const tY = cy * 4 * k;
        const rotZ = cx * 0.6 * k;
        headRef.current.style.transform =
          `translate3d(${tX}px, ${tY}px, 0) skew(${skX}deg, ${skY}deg) rotate(${rotZ}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [kineticStrength]);

  return (
    <section id="hero" data-screen-label="01 Hero" className="hero">
      <div className="hero-text">
        <h1 ref={headRef} style={{ transformOrigin: 'left center', willChange: 'transform' }}>
          <span className="line"><span>I&nbsp;build</span></span>
          <span className="line"><span className="amber-word">things</span></span>
          <span className="line"><span>people love.</span></span>
        </h1>

        <div className="hero-sub">
          software engineer<span className="dot"></span>based in Southern California
        </div>

        <div className="hero-ctas">
          <a
            className="btn btn-solid"
            href="#work"
            onClick={(e) => { e.preventDefault(); document.getElementById('work').scrollIntoView({ behavior: 'smooth' }); }}
          >
            see my work
            <svg className="arrow" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            className="btn btn-ghost"
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}
          >
            say hello
          </a>
          <div className="hero-cta-stat">
            <span className="hero-cta-stat-num">5+</span>
            <span className="hero-cta-stat-lbl">yrs exp</span>
          </div>
        </div>
      </div>

      <div className="hero-camera" style={{ justifySelf: 'center' }}>
        <Camera />
      </div>
    </section>
  );
};

export default Hero;
