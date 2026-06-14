import { useState, useEffect, useRef } from 'react';
import { Droplets, Users, TreePine, Sprout, GraduationCap, BookOpen, MapPin } from 'lucide-react';

const STATS = [
  { Icon: Droplets,      value: 700, suffix: '+', key: 'water' },
  { Icon: Users,         value: 220, suffix: '',  key: 'families' },
  { Icon: TreePine,      value: 300, suffix: '',  key: 'trees' },
  { Icon: Sprout,        value: 20,  suffix: '',  key: 'nurseries' },
  { Icon: GraduationCap, value: 150, suffix: '',  key: 'youth' },
  { Icon: BookOpen,      value: 200, suffix: '',  key: 'students' },
  { Icon: MapPin,        value: 4,   suffix: '',  key: 'municipalities' },
];

const ACCENTS = [
  { cardBg: 'rgba(16,185,129,0.06)',  iconBg: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.22)',  num: '#047857', icon: '#059669', shadow: 'rgba(16,185,129,0.22)' },
  { cardBg: 'rgba(59,130,246,0.06)',  iconBg: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.22)',  num: '#1d4ed8', icon: '#2563eb', shadow: 'rgba(59,130,246,0.22)' },
  { cardBg: 'rgba(245,158,11,0.06)',  iconBg: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.22)',  num: '#92400e', icon: '#b45309', shadow: 'rgba(245,158,11,0.22)' },
  { cardBg: 'rgba(16,185,129,0.06)',  iconBg: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.22)',  num: '#047857', icon: '#059669', shadow: 'rgba(16,185,129,0.22)' },
  { cardBg: 'rgba(139,92,246,0.06)',  iconBg: 'rgba(139,92,246,0.14)',  border: 'rgba(139,92,246,0.22)',  num: '#5b21b6', icon: '#7c3aed', shadow: 'rgba(139,92,246,0.22)' },
  { cardBg: 'rgba(239,68,68,0.06)',   iconBg: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.22)',   num: '#991b1b', icon: '#dc2626', shadow: 'rgba(239,68,68,0.22)'  },
  { cardBg: 'rgba(20,184,166,0.06)',  iconBg: 'rgba(20,184,166,0.14)',  border: 'rgba(20,184,166,0.22)',  num: '#0f766e', icon: '#14b8a6', shadow: 'rgba(20,184,166,0.22)' },
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
  const { Icon } = stat;

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setVisible(true), index * 90);
    return () => clearTimeout(t);
  }, [started, index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? accent.cardBg.replace('0.06', '0.12')
          : accent.cardBg,
        border: `1.5px solid ${hovered ? accent.border.replace('0.22', '0.45') : accent.border}`,
        borderRadius: '18px',
        padding: '28px 16px 24px',
        textAlign: 'center',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: !visible
          ? 'translateY(22px) scale(0.95)'
          : hovered
            ? 'translateY(-7px) scale(1.03)'
            : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 16px 40px ${accent.shadow}, 0 4px 12px rgba(0,0,0,0.06)`
          : '0 2px 8px rgba(0,0,0,0.04)',
        transition:
          'opacity 0.5s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: hovered
          ? accent.iconBg.replace('0.14', '0.24')
          : accent.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        transform: hovered ? 'scale(1.12) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease',
      }}>
        <Icon size={26} color={accent.icon} strokeWidth={1.8} />
      </div>

      {/* Count */}
      <div style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        fontWeight: 800,
        color: accent.num,
        lineHeight: 1,
        marginBottom: '10px',
        fontFamily: 'var(--font-latin)',
        letterSpacing: '-0.02em',
      }}>
        {count}{stat.suffix}
      </div>

      {/* Label */}
      <div style={{
        fontSize: '0.8rem',
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
