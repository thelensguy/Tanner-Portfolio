import { useState, useEffect } from 'react';

const SunIcon = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.87 3.87l1.06 1.06M11.07 11.07l1.06 1.06M11.07 3.87l-1.06 1.06M4.93 11.07l-1.06 1.06"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
    <path d="M13.5 9A6 6 0 1 1 7 2.5a4.5 4.5 0 0 0 6.5 6.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Nav = ({ active, darkMode, onToggleDark }) => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#hero" onClick={(e) => go(e, 'hero')} className="logo" data-cursor="ring">
          <svg className="logo-icon" viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6"   stroke="currentColor" strokeWidth="1.1" />
            <circle cx="7" cy="7" r="3.2" stroke="currentColor" strokeWidth="0.9" />
            <circle cx="7" cy="7" r="1.2" fill="var(--amber)" />
          </svg>
          TANNER
        </a>

        {/* Desktop nav */}
        <div className="nav-links">
          <a href="#work"    onClick={(e) => go(e, 'work')}    className={active === 'work'    ? 'active' : ''} data-cursor="ring">work</a>
          <a href="#focus"   onClick={(e) => go(e, 'focus')}   className={active === 'focus'   ? 'active' : ''} data-cursor="ring">in focus</a>
          <a href="#contact" onClick={(e) => go(e, 'contact')} className={active === 'contact' ? 'active' : ''} data-cursor="ring">contact</a>
          <button className="nav-dark-toggle" onClick={onToggleDark} data-cursor="ring"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Mobile right: dark toggle + hamburger */}
        <div className="nav-mobile-right">
          <button className="nav-dark-toggle" onClick={onToggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Fullscreen overlay */}
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <button className="nav-overlay-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg viewBox="0 0 16 16" width="18" height="18" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
        <a href="#work"    onClick={(e) => go(e, 'work')}    className={active === 'work'    ? 'active' : ''}>work</a>
        <a href="#focus"   onClick={(e) => go(e, 'focus')}   className={active === 'focus'   ? 'active' : ''}>in focus</a>
        <a href="#contact" onClick={(e) => go(e, 'contact')} className={active === 'contact' ? 'active' : ''}>contact</a>
      </div>
    </>
  );
};

export default Nav;
