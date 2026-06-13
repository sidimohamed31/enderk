import { useState } from 'react';
import { Droplet, Waves, DollarSign, Zap, BookOpen, Check } from 'lucide-react';

export default function Interventions({ t, lang }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categoryIcons = {
    water: <Droplet size={18} />,
    ocean: <Waves size={18} />,
    economy: <DollarSign size={18} />,
    energy: <Zap size={18} />,
    community: <BookOpen size={18} />
  };

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tous' : 'All' },
    { id: 'water', name: t.interventions.categories.water, icon: categoryIcons.water },
    { id: 'ocean', name: t.interventions.categories.ocean, icon: categoryIcons.ocean },
    { id: 'economy', name: t.interventions.categories.economy, icon: categoryIcons.economy },
    { id: 'energy', name: t.interventions.categories.energy, icon: categoryIcons.energy },
    { id: 'community', name: t.interventions.categories.community, icon: categoryIcons.community }
  ];

  const filteredInterventions = activeCategory === 'all' 
    ? t.interventions.list 
    : t.interventions.list.filter(item => item.cat === activeCategory);

  return (
    <section 
      id="interventions" 
      style={{
        padding: '100px 0',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="container">
        {/* Section Header */}
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
            {t.interventions.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.interventions.subtitle}
          </p>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '16px auto 0 auto', borderRadius: '2px' }} />
        </div>

        {/* Categories Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '40px'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedId(null);
              }}
              style={{
                background: activeCategory === cat.id 
                  ? 'linear-gradient(135deg, var(--emerald-500), var(--emerald-600))'
                  : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === cat.id ? 'white' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'transparent' : 'var(--border-color)',
                padding: '10px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Interventions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          {filteredInterventions.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '30px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderLeft: `4px solid ${
                    item.cat === 'water' ? '#26BDE2' :
                    item.cat === 'ocean' ? '#0A97D9' :
                    item.cat === 'economy' ? '#DDA63A' :
                    item.cat === 'energy' ? '#F39C12' : '#4C9F38'
                  }`,
                  transform: isExpanded ? 'scale(1.02)' : 'none',
                  borderColor: isExpanded ? 'var(--emerald-500)' : 'var(--glass-border)'
                }}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--emerald-500)'
                  }}>
                    {categoryIcons[item.cat]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, letterSpacing: '1px' }}>
                    {item.id.toString().padStart(2, '0')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {item.name}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : '3',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.desc}
                </p>

                {/* Sub interventions listing inside card expansion */}
                {isExpanded && (
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--emerald-500)' }}>
                      {lang === 'ar' ? 'الأنشطة الرئيسية:' : lang === 'fr' ? 'Activités principales :' : 'Core Activities:'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Simple mock indicators for high-quality representation */}
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={14} style={{ color: 'var(--emerald-500)', marginTop: '3px', flexShrink: 0 }} />
                        <span>{lang === 'ar' ? 'إطلاق حملات التوعية وبناء القدرات المحلية.' : 'Capacity building & awareness campaigns.'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={14} style={{ color: 'var(--emerald-500)', marginTop: '3px', flexShrink: 0 }} />
                        <span>{lang === 'ar' ? 'تنفيذ مبادرات ميدانية لدعم الفئات الهشة.' : 'Field implementations supporting vulnerable communities.'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={14} style={{ color: 'var(--emerald-500)', marginTop: '3px', flexShrink: 0 }} />
                        <span>{lang === 'ar' ? 'تعزيز الشراكات الفنية والحكومية المستمرة.' : 'Fostering technical and governmental partnerships.'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STRATEGIC GOALS SUBSECTION */}
        <div id="goals" style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '12px'
            }}>
              {t.goals.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              {t.goals.subtitle}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {t.goals.list.map((goal, index) => (
              <div 
                key={index} 
                className="glass-panel"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  borderRadius: '12px'
                }}
              >
                <div style={{
                  background: 'var(--emerald-500)',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
