const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "darkMode": false,
  "kineticStrength": 1,
  "amberHue": 78,
  "showCustomCursor": true
}/*EDITMODE-END*/;

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('hero');

  // active section tracker (for nav underline)
  React.useEffect(() => {
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

  // dark mode toggle
  React.useEffect(() => {
    document.body.classList.toggle('dark', !!tweaks.darkMode);
  }, [tweaks.darkMode]);

  // amber hue tweak — recalc CSS variables
  React.useEffect(() => {
    const h = tweaks.amberHue;
    document.documentElement.style.setProperty('--amber', `oklch(0.83 0.13 ${h})`);
    document.documentElement.style.setProperty('--amber-deep', `oklch(0.72 0.13 ${h})`);
  }, [tweaks.amberHue]);

  // hide custom cursor toggle
  React.useEffect(() => {
    if (!tweaks.showCustomCursor) {
      document.documentElement.style.cursor = 'auto';
      document.body.style.cursor = 'auto';
    } else {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    }
  }, [tweaks.showCustomCursor]);

  return (
    <>
      {tweaks.showCustomCursor && <Cursor />}
      <Nav active={active} dark={tweaks.darkMode} />
      <Hero kineticStrength={tweaks.kineticStrength} />
      <Work />
      <InFocus />
      <Contact />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Mode">
          <TweakToggle
            label="Dark mode"
            value={tweaks.darkMode}
            onChange={(v) => setTweak('darkMode', v)}
          />
          <TweakToggle
            label="Custom amber cursor"
            value={tweaks.showCustomCursor}
            onChange={(v) => setTweak('showCustomCursor', v)}
          />
        </TweakSection>

        <TweakSection title="Motion">
          <TweakSlider
            label="Hero kinetic strength"
            value={tweaks.kineticStrength}
            min={0} max={2.5} step={0.1}
            onChange={(v) => setTweak('kineticStrength', v)}
          />
        </TweakSection>

        <TweakSection title="Color">
          <TweakSlider
            label="Amber hue"
            value={tweaks.amberHue}
            min={50} max={110} step={1}
            onChange={(v) => setTweak('amberHue', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
