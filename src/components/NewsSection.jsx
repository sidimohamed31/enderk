import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileImage, Newspaper, Tag } from 'lucide-react';
import { fetchNews } from '../lib/newsApi';

const CATEGORY_PALETTE = {
  default: { bg: 'rgba(16,185,129,0.10)', color: '#047857', border: 'rgba(16,185,129,0.22)' },
  blue:    { bg: 'rgba(59,130,246,0.10)',  color: '#1d4ed8', border: 'rgba(59,130,246,0.22)' },
  purple:  { bg: 'rgba(139,92,246,0.10)', color: '#5b21b6', border: 'rgba(139,92,246,0.22)' },
  amber:   { bg: 'rgba(245,158,11,0.10)',  color: '#92400e', border: 'rgba(245,158,11,0.22)' },
  red:     { bg: 'rgba(239,68,68,0.10)',   color: '#991b1b', border: 'rgba(239,68,68,0.22)'  },
};

const CATEGORY_MAP = {
  'تقرير': 'blue', 'فعالية': 'default', 'إعلان': 'amber', 'حدث': 'purple', 'طارئ': 'red',
  'Rapport': 'blue', 'Événement': 'default', 'Annonce': 'amber', 'Presse': 'purple',
  'Report': 'blue', 'Event': 'default', 'Announcement': 'amber', 'Press': 'purple',
};

function getCategoryPalette(category) {
  return CATEGORY_PALETTE[CATEGORY_MAP[category]] || CATEGORY_PALETTE.default;
}

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ar' ? 'ar-TN' : lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  } catch {
    return dateStr;
  }
}

function CategoryBadge({ category }) {
  const p = getCategoryPalette(category);
  if (!category) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.05em', background: p.bg, color: p.color,
      border: `1px solid ${p.border}`, whiteSpace: 'nowrap',
    }}>
      <Tag size={10} />
      {category}
    </span>
  );
}

/* ─── Featured card: image left, content right ──────────────────────────── */
function FeaturedCard({ article, lang, t, visible }) {
  const [hovered, setHovered] = useState(false);
  const coverImage = article.images[0] || null;
  const p = getCategoryPalette(article.category);

  return (
    <Link
      to={`/news/${article.id}`}
      state={{ article }}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '24px', overflow: 'hidden', background: 'white',
          border: `1.5px solid ${hovered ? 'rgba(16,185,129,0.32)' : 'rgba(16,185,129,0.12)'}`,
          boxShadow: hovered
            ? '0 28px 60px rgba(16,185,129,0.15), 0 8px 24px rgba(0,0,0,0.07)'
            : '0 4px 18px rgba(0,0,0,0.05)',
          opacity: visible ? 1 : 0,
          transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(32px)',
          transition: 'opacity 0.65s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.25s ease',
          display: 'flex',
          flexDirection: 'row',
          minHeight: '300px',
          height: '100%',
          cursor: 'pointer',
        }}
      >
        {/* Image side */}
        <div style={{
          width: '42%', flexShrink: 0, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(16,185,129,0.14))',
        }}>
          {coverImage ? (
            <img
              src={coverImage} alt={article.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Newspaper size={56} color="rgba(16,185,129,0.32)" strokeWidth={1.1} />
            </div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: lang === 'ar'
              ? 'linear-gradient(to left, rgba(255,255,255,0.1) 0%, transparent 60%)'
              : 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Content side */}
        <div style={{
          flex: 1, padding: '28px 28px 24px',
          display: 'flex', flexDirection: 'column', gap: '11px', minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {article.category && <CategoryBadge category={article.category} />}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              color: 'var(--text-muted)', fontSize: '0.76rem',
            }}>
              <Calendar size={12} />
              {formatDate(article.publishedAt, lang)}
            </div>
          </div>

          <h3 style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontWeight: 800,
            color: 'var(--text-primary)', lineHeight: 1.3, margin: 0,
          }}>
            {article.title}
          </h3>

          {article.excerpt && (
            <p style={{
              fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.7,
              margin: 0, flex: 1,
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {article.excerpt}
            </p>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: p.color, fontWeight: 700, fontSize: '0.84rem',
              borderBottom: `1.5px solid ${p.border}`, paddingBottom: '2px',
            }}>
              {t.news.readMore}
              <ArrowRight size={14} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Side card ─────────────────────────────────────────────────────────── */
function SmallCard({ article, lang, t, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const coverImage = article.images[0] || null;
  const p = getCategoryPalette(article.category);

  return (
    <Link
      to={`/news/${article.id}`}
      state={{ article }}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', gap: '14px', alignItems: 'flex-start',
          padding: '14px', borderRadius: '18px', cursor: 'pointer',
          background: hovered ? 'rgba(16,185,129,0.045)' : 'white',
          border: `1.5px solid ${hovered ? 'rgba(16,185,129,0.28)' : 'rgba(16,185,129,0.10)'}`,
          boxShadow: hovered
            ? '0 8px 30px rgba(16,185,129,0.11), 0 2px 8px rgba(0,0,0,0.04)'
            : '0 2px 8px rgba(0,0,0,0.04)',
          opacity: visible ? 1 : 0,
          transform: visible ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(22px)',
          transition: `opacity 0.6s ${index * 0.1 + 0.15}s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.2s ease, border-color 0.2s ease`,
        }}
      >
        {/* Thumbnail */}
        <div style={{
          width: '84px', height: '84px', borderRadius: '13px', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(16,185,129,0.14))',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {coverImage ? (
            <img
              src={coverImage} alt={article.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <FileImage size={26} color="rgba(16,185,129,0.38)" strokeWidth={1.3} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {article.category && (
            <div style={{ marginBottom: '7px' }}>
              <CategoryBadge category={article.category} />
            </div>
          )}
          <h3 style={{
            fontSize: '0.91rem', fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.35, margin: '0 0 6px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
            <Calendar size={11} />
            {formatDate(article.publishedAt, lang)}
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ color: p.color, fontSize: '0.76rem', fontWeight: 700 }}>
              {t.news.readMore} →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────── */
export default function NewsSection({ t, lang }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetchNews()
      .then((data) => { if (mounted) { setArticles(data); setLoading(false); } })
      .catch(() => { if (mounted) { setLoadError(t.news.loadError); setLoading(false); } });
    return () => { mounted = false; };
  }, [t.news.loadError]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.06 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const featured = articles[0] || null;
  const sideArticles = articles.slice(1, 4);

  return (
    <section
      ref={ref}
      style={{
        padding: '88px 0 100px',
        background: 'linear-gradient(180deg, #eef8f4 0%, #f8fafb 100%)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '56px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 16px', borderRadius: '20px',
            background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.28)',
            color: 'var(--emerald-700)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '14px',
          }}>
            <Newspaper size={12} />
            {t.news.badge}
          </span>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
            color: 'var(--text-primary)', lineHeight: 1.25, margin: 0,
          }}>
            {t.news.title}
          </h2>

          <p style={{
            fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '12px',
            maxWidth: '560px', marginInline: 'auto', lineHeight: 1.65,
          }}>
            {t.news.subtitle}
          </p>

          <div style={{
            width: '54px', height: '4px', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))',
            margin: '16px auto 0',
          }} />
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[1, 2, 3].map((k) => (
              <div key={k} style={{
                borderRadius: '20px', height: '260px',
                background: 'linear-gradient(90deg, rgba(16,185,129,0.06) 25%, rgba(16,185,129,0.13) 50%, rgba(16,185,129,0.06) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.6s infinite',
              }} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && loadError && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{loadError}</p>
        )}

        {/* Empty */}
        {!loading && !loadError && articles.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            borderRadius: '24px', border: '1.5px dashed rgba(16,185,129,0.25)',
            background: 'rgba(16,185,129,0.03)',
          }}>
            <Newspaper size={48} color="rgba(16,185,129,0.3)" strokeWidth={1.2} style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{t.news.empty}</p>
          </div>
        )}

        {/* Content grid */}
        {!loading && !loadError && articles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: articles.length === 1 ? '1fr' : 'minmax(0,1.35fr) minmax(0,0.65fr)',
            gap: '20px',
            alignItems: 'start',
          }}>
            <FeaturedCard article={featured} lang={lang} t={t} visible={visible} />

            {sideArticles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sideArticles.map((article, i) => (
                  <SmallCard key={article.id} article={article} lang={lang} t={t} index={i} visible={visible} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
