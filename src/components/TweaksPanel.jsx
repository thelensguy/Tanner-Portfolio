import { useState } from 'react';

export const useTweaks = (defaults) => {
  const [tweaks, setTweaks] = useState(defaults);
  const setTweak = (key, value) => setTweaks(prev => ({ ...prev, [key]: value }));
  return [tweaks, setTweak];
};

export const TweaksPanel = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9998,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'block', marginLeft: 'auto',
          background: 'var(--ink)', color: 'var(--cream)',
          border: '1px solid rgba(232,196,106,0.3)',
          borderRadius: 6, padding: '6px 12px',
          fontFamily: 'inherit', fontSize: 10, letterSpacing: '0.15em',
          textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        {title} {open ? '▲' : '▼'}
      </button>
      {open && (
        <div style={{
          marginTop: 8,
          background: 'var(--ink)',
          border: '1px solid rgba(232,196,106,0.2)',
          borderRadius: 8,
          padding: '16px',
          minWidth: 220,
          boxShadow: '0 18px 40px -16px rgba(0,0,0,0.6)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const TweakSection = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{
      fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: 'var(--amber)', marginBottom: 8,
    }}>{title}</div>
    {children}
  </div>
);

export const TweakToggle = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', color: 'var(--cream)' }}>
    <span style={{ letterSpacing: '0.04em' }}>{label}</span>
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 999,
        background: value ? 'var(--amber-deep)' : 'rgba(255,255,255,0.12)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: value ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: 'var(--cream)', transition: 'left 0.25s',
      }} />
    </button>
  </div>
);

export const TweakSlider = ({ label, value, min, max, step, onChange }) => (
  <div style={{ padding: '4px 0', color: 'var(--cream)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ color: 'var(--amber)', minWidth: 28, textAlign: 'right' }}>{value}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--amber-deep)', cursor: 'pointer' }}
    />
  </div>
);
