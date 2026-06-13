import { useState } from 'react';
import { Eye, ShieldCheck, Heart, Award } from 'lucide-react';

export default function AboutUs({ t, lang }) {
  const [hoveredValue, setHoveredValue] = useState(null);

  // Match icons with values
  const icons = [
    <ShieldCheck size={28} style={{ color: 'var(--emerald-500)' }} />,
    <Eye size={28} style={{ color: 'var(--ocean-500)' }} />,
    <Heart size={28} style={{ color: 'var(--emerald-500)' }} />,
    <Award size={28} style={{ color: 'var(--gold-500)' }} />,
    <Award size={28} style={{ color: 'var(--emerald-500)' }} />
  ];

  return (
    <section 
      id="about" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(to bottom, var(--bg-app), rgba(22, 160, 133, 0.03))',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-500))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            {t.about.title}
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {/* Text / NGO Info */}
        <div className="glass-panel" style={{
          padding: '40px',
          marginBottom: '50px',
          borderRadius: '24px'
        }}>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: 1.8,
            fontWeight: 500
          }}>
            {t.about.text1}
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8
          }}>
            {t.about.text2}
          </p>
        </div>

        {/* Vision & Mission Double Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {/* Vision card */}
          <div className="glass-panel" style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: lang === 'ar' ? 'auto' : '-20px',
              left: lang === 'ar' ? '-20px' : 'auto',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, var(--emerald-glow) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(22, 160, 133, 0.15)',
              border: '1px solid rgba(22, 160, 133, 0.2)',
              color: 'var(--emerald-500)'
            }}>
              <Eye size={28} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {t.about.vision_title}
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t.about.vision_text}
            </p>
          </div>

          {/* Mission card */}
          <div className="glass-panel" style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: lang === 'ar' ? 'auto' : '-20px',
              left: lang === 'ar' ? '-20px' : 'auto',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, var(--ocean-glow) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(41, 128, 185, 0.15)',
              border: '1px solid rgba(41, 128, 185, 0.2)',
              color: 'var(--ocean-500)'
            }}>
              <Award size={28} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {t.about.mission_title}
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t.about.mission_text}
            </p>
          </div>
        </div>

        {/* Core Values grid */}
        <div style={{ marginTop: '80px' }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {t.about.values_title}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {t.about.values_list.map((val, idx) => (
              <div
                key={idx}
                className="glass-panel"
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transform: hoveredValue === idx ? 'translateY(-5px)' : 'none',
                  borderColor: hoveredValue === idx ? 'var(--emerald-500)' : 'var(--glass-border)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {icons[idx % icons.length]}
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{val.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
