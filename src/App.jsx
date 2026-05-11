import { useState, useEffect } from 'react';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import InFocus from './components/InFocus.jsx';
import Contact from './components/Contact.jsx';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('darkMode') === 'true'; } catch { return false; }
  });
  const [active, setActive] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);

  const toggleDark = () => setDarkMode(d => !d);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    try { localStorage.setItem('darkMode', String(darkMode)); } catch {}
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollPct(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['hero', 'work', 'focus', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: `${scrollPct}%`, height: 2,
        background: '#e8c46a',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'width 0.1s linear',
      }} />
      <Cursor />
      <Nav active={active} darkMode={darkMode} onToggleDark={toggleDark} />
      <main>
        <Hero />
        <Work />
        <InFocus />
        <Contact />
      </main>
    </>
  );
};

export default App;
