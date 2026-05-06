import { useRef, useState, useEffect } from 'react';

const Cursor = () => {
  const ref = useRef(null);
  const [mode, setMode] = useState('dot'); // dot | pill | ring
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (hidden) setHidden(false);

      const t = e.target;
      if (!t) return;
      const link = t.closest('a, button, [data-cursor="ring"]');
      const txt = t.closest('h1, h2, h3, p, [data-cursor="pill"]');
      if (link) setMode('ring');
      else if (txt && !link) setMode('pill');
      else setMode('dot');
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
    };
  }, [hidden]);

  return (
    <div
      ref={ref}
      className={`cursor ${mode}`}
      style={{ opacity: hidden ? 0 : 1 }}
    />
  );
};

export default Cursor;
