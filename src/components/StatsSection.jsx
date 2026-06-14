import { useState, useEffect, useRef } from 'react';

const STATS = [
  { icon: '💧', value: 700, suffix: '+', key: 'water' },
  { icon: '👨‍👩‍👧‍👦', value: 220, suffix: '', key: 'families' },
  { icon: '🌳', value: 300, suffix: '', key: 'trees' },
  { icon: '🌱', value: 20, suffix: '', key: 'nurseries' },
  { icon: '👩‍🎓👨‍🎓', value: 150, suffix: '', key: 'youth' },
  { icon: '🏫', value: 200, suffix: '', key: 'students' },
  { icon: '🏘️', value: 4, suffix: '', key: 'municipalities' },
];

const ACCENTS = [
  { bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.25)',  num: '#047857', shadow: 'rgba(16,185,129,0.22)' },
  { bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.25)',  num: '#1d4ed8', shadow: 'rgba(59,130,246,0.22)' },
  { bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.25)',  num: '#92400e', shadow: 'rgba(245,158,11,0.22)' },
  { bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.25)',  num: '#047857', shadow: 'rgba(16,185,129,0.22)' },
  { bg: 'rgba(139,92,246,0.07)',  border: 'rgba(139,92,246,0.25)',  num: '#5b21b6', shadow: 'rgba(139,92,246,0.22)' },
  { bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.25)',   num: '#991b1b', shadow: 'rgba(239,68,68,0.22)' },
  { bg: 'rgba(20,184,166,0.07)',  border: 'rgba(20,184,166,0.25)',  num: '#0f766e', shadow: 'rgba(20,184,166,0.22)' },
];

function useCountUp(target, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const duration = 1800;
    const frame = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, started]);
  return count;
}

function StatCard({ stat, label, index, started }) {
  const count = useCountUp(stat.value, started);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const accent = ACCENTS[index];

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setVisible(true), index * 90);
    return () => clearTimeout(t);
  }, [started, index]);

  const translateY = !visible ? 24 : hovered ? -7 : 0;
  const scale = !visible ? 0.95 : hovered ? 1.03 : 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? accent.bg.replace('0.07', '0.14')
          : accent.bg,
        border: `1.5px solid ${hovered ? accent.border.replace('0.25', '0.5') : accent.border}`,
        borderRadius: '18px',
        padding: '30px 18px 26px',
        textAlign: 'center',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: `translateY(${translateY}px) scale(${scale})`,
        boxShadow: hovered
          ? `0 16px 40px ${accent.shadow}, 0 4px 12px rgba(0,0,0,0.06)`
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition:
          'opacity 0.5s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{
        fontSize: '2.3rem',
        marginBottom: '14px',
        lineHeight: 1,
        display: 'block',
        transform: hovered ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {stat.icon}
      </div>

      <div style={{
        fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
        fontWeight: 800,
        color: accent.num,
        lineHeight: 1,
        marginBottom: '10px',
        fontFamily: 'var(--font-latin)',
        letterSpacing: '-0.02em',
      }}>
        {count}{stat.suffix}
      </div>

      <div style={{
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.55,
        fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsSection({ t }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: '80px 0 88px',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, #eef8f4 100%)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: '20px',
            background: 'var(--emerald-glow)',
            border: '1px solid rgba(16,185,129,0.28)',
            color: 'var(--emerald-700)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {t.stats.badge}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            margin: 0,
          }}>
            {t.stats.title}
          </h2>
          <div style={{
            width: '54px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))',
            margin: '14px auto 0',
          }} />
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(138px, 1fr))',
          gap: '16px',
        }}>
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.key}
              stat={stat}
              label={t.stats.items[stat.key]}
              index={i}
              started={started}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
