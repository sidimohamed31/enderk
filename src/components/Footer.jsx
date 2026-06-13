import { useNavigate } from 'react-router-dom';
import { Globe, ArrowUp } from 'lucide-react';
import logoImg from '../assets/logo.png';

const routeMap = {
  home: '/',
  about: '/about',
  interventions: '/interventions',
  map: '/map'
};

export default function Footer({ t, lang }) {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        background: 'linear-gradient(180deg, #f0fdf8 0%, #ffffff 100%)',
        color: 'var(--text-primary)',
        borderTop: '1px solid rgba(16,185,129,0.15)',
        paddingTop: '80px',
        paddingBottom: '30px',
        position: 'relative'
      }}
    >
      {/* Scroll to Top floating arrow */}
      <button 
        onClick={scrollToTop}
        style={{
          position: 'absolute',
          top: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--emerald-500)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(22, 160, 133, 0.4)',
          transition: 'var(--transition-smooth)',
          zIndex: 10
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-50%) translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'}
      >
        <ArrowUp size={20} />
      </button>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Col 1: Logo & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={logoImg} alt="ENDERK Logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                {t.footer.about_title}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {t.footer.about_desc}
            </p>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-500)', fontStyle: 'italic' }}>
              “{t.slogan}”
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid var(--emerald-500)', paddingBottom: '8px', width: 'fit-content' }}>
              {t.footer.links_title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <button onClick={() => navigate(routeMap.home)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textAlign: 'start', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--emerald-600)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>
                {t.nav.home}
              </button>
              <button onClick={() => navigate(routeMap.about)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textAlign: 'start', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--emerald-600)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>
                {t.nav.about}
              </button>
              <button onClick={() => navigate(routeMap.interventions)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textAlign: 'start', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--emerald-600)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>
                {t.nav.interventions}
              </button>
              <button onClick={() => navigate(routeMap.map)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textAlign: 'start', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--emerald-600)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>
                {t.nav.map}
              </button>
            </div>
          </div>

          {/* Col 3: Partners & Integrity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid var(--emerald-500)', paddingBottom: '8px', width: 'fit-content' }}>
              {lang === 'ar' ? 'القيم والشفافية' : lang === 'fr' ? 'Valeurs & Transparence' : 'Values & Governance'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {lang === 'ar' 
                ? 'تلتزم المنظمة بأعلى معايير الحوكمة الرشيدة والمشاركة المجتمعية الفعالة لحفظ الموارد والعدالة البيئية.'
                : 'We are committed to the highest standards of local governance, community participation, and environmental justice.'}
            </p>
            {/* Tiny mock partnership badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.20)',
              fontSize: '0.8rem',
              color: 'var(--emerald-700)',
              fontWeight: 600,
              width: 'fit-content'
            }}>
              <Globe size={14} />
              <span>{lang === 'ar' ? 'عضو مرخص بالاتحاد البيئي' : 'Certified Environmental Partner'}</span>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div style={{
          borderTop: '1px solid rgba(16,185,129,0.12)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.83rem',
          color: 'var(--text-muted)'
        }}>
          <span>{t.footer.rights}</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>{lang === 'ar' ? 'حماية البيانات' : 'Data Privacy'}</span>
            <span>{lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
