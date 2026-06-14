import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Newspaper, Tag } from 'lucide-react';
import { fetchNewsArticle } from '../lib/newsApi';

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

function CategoryBadge({ category, light = false }) {
  const p = getCategoryPalette(category);
  if (!category) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '5px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700,
      letterSpacing: '0.05em', whiteSpace: 'nowrap',
      background: light ? 'rgba(255,255,255,0.18)' : p.bg,
      color: light ? 'white' : p.color,
      border: `1px solid ${light ? 'rgba(255,255,255,0.35)' : p.border}`,
      backdropFilter: light ? 'blur(6px)' : 'none',
    }}>
      <Tag size={11} />
      {category}
    </span>
  );
}

export default function NewsDetail({ t, lang }) {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(!location.state?.article);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.article) return;
    fetchNewsArticle(id)
      .then(setArticle)
      .catch(() => setError(t.news.notFound))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const isRTL = lang === 'ar';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const backLinkBase = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none',
    padding: '9px 20px', borderRadius: '50px',
    transition: 'background 0.2s, transform 0.15s',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', background: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', padding: '48px 24px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          {[1, 0.4, 0.7, 1, 0.9, 0.8].map((w, i) => (
            <div key={i} style={{
              height: i === 0 ? '360px' : '18px', borderRadius: i === 0 ? '16px' : '6px',
              width: `${w * 100}%`, marginBottom: i === 0 ? '28px' : '12px',
              background: 'linear-gradient(90deg, rgba(16,185,129,0.06) 25%, rgba(16,185,129,0.12) 50%, rgba(16,185,129,0.06) 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
            }} />
          ))}
        </div>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{
        minHeight: '70vh', background: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '20px', padding: '48px 24px', textAlign: 'center',
      }}>
        <Newspaper size={60} color="rgba(16,185,129,0.3)" strokeWidth={1.1} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          {error || t.news.notFound}
        </p>
        <Link to="/" style={{ ...backLinkBase, color: '#047857', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)' }}>
          <BackIcon size={15} />
          {t.news.back}
        </Link>
      </div>
    );
  }

  const coverImage = article.images[0] || null;
  const extraImages = article.images.slice(1);
  const p = getCategoryPalette(article.category);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── Hero ── */}
      {coverImage ? (
        <div style={{ position: 'relative', height: 'clamp(380px, 65vh, 720px)', overflow: 'hidden' }}>
          <img
            src={coverImage} alt={article.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
            }}
          />
          {/* Dark gradient bottom-up */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.28) 45%, transparent 100%)',
          }} />

          {/* Back button top */}
          <div style={{ position: 'absolute', top: '28px', insetInlineStart: '28px', zIndex: 10 }}>
            <Link
              to="/"
              style={{ ...backLinkBase, color: 'white', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.32)', backdropFilter: 'blur(8px)' }}
            >
              <BackIcon size={15} />
              {t.news.back}
            </Link>
          </div>

          {/* Title overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 24px 40px',
          }}>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <CategoryBadge category={article.category} light />
              <h1 style={{
                color: 'white', fontWeight: 800, margin: '12px 0 0',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.22,
                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}>
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        /* No image: green-tinted header */
        <div style={{
          background: 'linear-gradient(135deg, #eef8f4 0%, #f0faf5 100%)',
          borderBottom: '1px solid rgba(16,185,129,0.15)',
          padding: '40px 24px 44px',
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <Link
              to="/"
              style={{ ...backLinkBase, color: '#047857', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', marginBottom: '28px' }}
            >
              <BackIcon size={15} />
              {t.news.back}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {article.category && <CategoryBadge category={article.category} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <Calendar size={13} />
                {formatDate(article.publishedAt, lang)}
              </div>
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', lineHeight: 1.22, margin: 0,
            }}>
              {article.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <article style={{ maxWidth: '820px', margin: '0 auto', padding: '44px 24px 88px' }}>

        {/* Date + back (when hero image exists) */}
        {coverImage && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
            marginBottom: '36px', paddingBottom: '28px',
            borderBottom: '1px solid rgba(16,185,129,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {article.category && <CategoryBadge category={article.category} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                <Calendar size={14} />
                {formatDate(article.publishedAt, lang)}
              </div>
            </div>
            <Link
              to="/"
              style={{ ...backLinkBase, color: '#047857', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.82rem' }}
            >
              <BackIcon size={14} />
              {t.news.back}
            </Link>
          </div>
        )}

        {/* No-image: separator after header */}
        {!coverImage && (
          <div style={{ marginBottom: '36px', paddingBottom: '0' }} />
        )}

        {/* Excerpt — styled as pull quote */}
        {article.excerpt && (
          <p style={{
            fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: 1.82,
            margin: '0 0 36px', fontStyle: 'italic',
            borderInlineStart: `4px solid ${p.border}`,
            paddingInlineStart: '22px',
            background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, ${p.bg} 0%, transparent 100%)`,
            paddingBlock: '14px',
            borderRadius: '0 8px 8px 0',
          }}>
            {article.excerpt}
          </p>
        )}

        {/* Body text */}
        {article.body && (
          <div style={{
            fontSize: '1rem', lineHeight: 2, color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
          }}>
            {article.body}
          </div>
        )}

        {/* Extra images gallery */}
        {extraImages.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: extraImages.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}>
              {extraImages.map((img, i) => (
                <img
                  key={i} src={img} alt={`${article.title} — ${i + 2}`}
                  style={{
                    width: '100%', aspectRatio: '4/3', objectFit: 'cover',
                    borderRadius: '14px', display: 'block',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {article.videoUrl && (
          <div style={{ marginTop: '44px' }}>
            <video
              src={article.videoUrl} controls
              style={{ width: '100%', borderRadius: '16px', maxHeight: '420px', background: '#000' }}
            />
          </div>
        )}

        {/* Back link bottom */}
        <div style={{
          marginTop: '64px', paddingTop: '32px',
          borderTop: '1px solid rgba(16,185,129,0.12)',
        }}>
          <Link
            to="/"
            style={{ ...backLinkBase, color: '#047857', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)' }}
          >
            <BackIcon size={15} />
            {t.news.back}
          </Link>
        </div>
      </article>
    </div>
  );
}
