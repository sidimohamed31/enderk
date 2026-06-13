import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Heart } from 'lucide-react';
import logoImg from '../assets/logo.png';

const routeMap = {
  home: '/',
  about: '/about',
  interventions: '/interventions',
  map: '/map',
  volunteer: '/volunteer',
  donate: '/donate',
  contact: '/contact'
};

export default function Navbar({ lang, setLang, t }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'interventions', label: t.nav.interventions },
    { id: 'map', label: t.nav.map },
    { id: 'volunteer', label: t.nav.volunteer },
    { id: 'contact', label: t.nav.contact }
  ];

  const languages = [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
    { code: 'en', name: 'English', dir: 'ltr' }
  ];

  const activeSection = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  const handleLangChange = (code) => {
    setLang(code);
    setLangDropdownOpen(false);
    setIsOpen(false);
  };

  const handleNavClick = (id) => {
    setIsOpen(false);
    navigate(routeMap[id] || '/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(16,185,129,0.12)',
      boxShadow: '0 1px 16px rgba(0,0,0,0.06)',
      width: '100%',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
        position: 'relative'
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
          {/* Logo SVG Graphic as Masterpiece Fallback + Text */}
          <img 
            src={logoImg} 
            alt="ENDERK Logo" 
            style={{ width: '54px', height: '54px', objectFit: 'contain' }} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              letterSpacing: '0.5px',
              fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)',
              background: 'linear-gradient(135deg, var(--emerald-500), var(--ocean-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {lang === 'ar' ? 'انديرك' : 'ENDERK'}
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-secondary)', 
              marginTop: '-4px',
              fontWeight: 500,
              letterSpacing: '1px'
            }}>
              {lang === 'ar' ? 'منظمة بيئية' : 'ENVIRONMENTAL NGO'}
            </span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav style={{ display: 'none', gap: '8px' }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeSection === item.id ? 'var(--emerald-500)' : 'var(--text-primary)',
                fontWeight: activeSection === item.id ? 700 : 500,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                position: 'relative',
                transition: 'var(--transition-smooth)'
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '16px',
                  right: '16px',
                  height: '2px',
                  background: 'var(--emerald-500)',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* DONATE CTA */}
          <button 
            onClick={() => { setIsOpen(false); navigate('/donate'); }}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 18px',
              fontSize: '0.9rem'
            }}
          >
            <Heart size={16} fill="white" />
            <span>{t.nav.donate}</span>
          </button>


          {/* LANGUAGE SELECTOR */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'var(--transition-smooth)'
              }}
            >
              <Globe size={16} />
              <span>{languages.find(l => l.code === lang).name}</span>
            </button>

            {langDropdownOpen && (
              <div 
                className="glass-panel" 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: lang === 'ar' ? 'auto' : 0,
                  left: lang === 'ar' ? 0 : 'auto',
                  marginTop: '8px',
                  width: '130px',
                  padding: '6px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200
                }}
              >
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    style={{
                      background: lang === l.code ? 'rgba(22, 160, 133, 0.15)' : 'transparent',
                      border: 'none',
                      color: lang === l.code ? 'var(--emerald-500)' : 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'start',
                      width: '100%',
                      fontWeight: lang === l.code ? 700 : 500,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{l.name}</span>
                    {lang === l.code && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-500)' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV PANEL */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '80px',
            left: '24px',
            right: '24px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(16,185,129,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            zIndex: 99
          }}
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: activeSection === item.id ? 'rgba(22, 160, 133, 0.1)' : 'transparent',
                border: 'none',
                color: activeSection === item.id ? 'var(--emerald-500)' : 'var(--text-primary)',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: lang === 'ar' ? 'right' : 'left',
                fontWeight: activeSection === item.id ? 700 : 500,
                fontSize: '1rem',
                width: '100%'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* STYLING RULES TO SUPPORT MEDIA QUERIES ON NAV */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}} />
    </header>
  );
}
