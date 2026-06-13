import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Users } from 'lucide-react';

import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import hero4 from '../assets/hero-4.jpeg';

const backgroundImages = [hero1, hero2, hero3, hero4];

export default function Hero({ t, lang }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? backgroundImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
  };

  return (
    <section 
      id="home" 
      style={{
        position: 'relative',
        height: '90vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: '#0d2e26'
      }}
    >
      {/* BACKGROUND CAROUSEL */}
      {backgroundImages.map((img, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentSlide ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 1
          }}
        >
          <img
            src={img}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(5, 25, 18, 0.35), rgba(5, 25, 18, 0.78))',
            pointerEvents: 'none'
          }} />
        </div>
      ))}

      {/* FLOATING PARTICLES/GLOW OVERLAYS */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '150px',
        background: 'linear-gradient(to top, var(--bg-app), transparent)',
        zIndex: 2
      }} />

      {/* CONTENT HERO CONTAINER */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 10,
        color: 'white',
        width: '100%',
        paddingTop: '60px'
      }}>
        <div style={{ maxWidth: '750px' }}>
          {/* Badge */}
          <div 
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(22, 160, 133, 0.2)',
              border: '1px solid rgba(22, 160, 133, 0.4)',
              color: '#00e699',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '24px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <span>{t.title}</span>
          </div>

          {/* Slogan & Slogan Slides */}
          <h1 
            key={`title-${currentSlide}`}
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              lineHeight: 1.2,
              fontWeight: 800,
              marginBottom: '20px',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          >
            {t.hero.slides[currentSlide].title}
          </h1>

          <p 
            key={`desc-${currentSlide}`}
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              textShadow: '0 2px 6px rgba(0,0,0,0.4)',
              maxWidth: '650px',
              lineHeight: 1.6
            }}
          >
            {t.hero.slides[currentSlide].text}
          </p>

          {/* Action Buttons */}
          <div 
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <button 
              onClick={() => navigate('/volunteer')}
              className="btn-primary" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                padding: '14px 28px'
              }}
            >
              <Users size={20} />
              <span>{t.hero.cta_volunteer}</span>
            </button>
            
            <button 
              onClick={() => navigate('/donate')}
              className="btn-secondary" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                padding: '12px 26px',
                color: '#ffffff',
                borderColor: '#ffffff'
              }}
            >
              <Heart size={20} />
              <span>{t.hero.cta_donate}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAROUSEL DOTS & NAV CONTROLS */}
      <div 
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          left: '24px',
          right: '24px',
          zIndex: 10
        }}
      >
        {/* SLIDE INDICATORS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {backgroundImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                border: 'none',
                width: idx === currentSlide ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === currentSlide ? 'var(--emerald-500)' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            />
          ))}
        </div>

        {/* CHEVRONS */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrev}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {lang === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            onClick={handleNext}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {lang === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </section>
  );
}
