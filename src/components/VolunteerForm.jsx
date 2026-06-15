import { useState } from 'react';
import { Award, User, Mail, Phone, MapPin, Briefcase, Heart, Download } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { submitVolunteer } from '../lib/volunteerApi';

export default function VolunteerForm({ t, lang }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    interest: '',
    experience: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const downloadCard = () => {
    const W = 520, H = 330, S = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * S;
    canvas.height = H * S;
    const ctx = canvas.getContext('2d');
    ctx.scale(S, S);

    const rRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    };

    const render = (logo) => {
      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0f2233');
      bg.addColorStop(1, '#0a1628');
      ctx.fillStyle = bg;
      rRect(0, 0, W, H, 20);
      ctx.fill();

      // Overlay tint
      const tint = ctx.createLinearGradient(0, 0, W * 0.6, H);
      tint.addColorStop(0, 'rgba(22,160,133,0.10)');
      tint.addColorStop(1, 'rgba(15,76,129,0.10)');
      ctx.fillStyle = tint;
      rRect(2, 2, W - 4, H - 4, 18);
      ctx.fill();

      // Green border
      ctx.strokeStyle = '#16a085';
      ctx.lineWidth = 2;
      rRect(1, 1, W - 2, H - 2, 19);
      ctx.stroke();

      // Logo
      if (logo) ctx.drawImage(logo, 30, 30, 28, 28);

      // Org name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('ENDERK', 66, 46);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '9px sans-serif';
      ctx.fillText('ENVIRONMENTAL NGO', 66, 60);

      // Status badge
      const badgeLabel = lang === 'ar' ? 'متطوع رسمي' : 'Active Volunteer';
      const badgeW = 122, badgeH = 24, badgeX = W - badgeW - 28;
      ctx.fillStyle = 'rgba(0,230,153,0.15)';
      rRect(badgeX, 31, badgeW, badgeH, 8);
      ctx.fill();
      ctx.strokeStyle = '#00e699';
      ctx.lineWidth = 1;
      rRect(badgeX, 31, badgeW, badgeH, 8);
      ctx.stroke();
      ctx.fillStyle = '#00e699';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeLabel, badgeX + badgeW / 2, 47);
      ctx.textAlign = 'left';

      // Header divider
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, 82); ctx.lineTo(W - 30, 82); ctx.stroke();

      // Avatar box
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      rRect(30, 100, 68, 68, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      rRect(30, 100, 68, 68, 14);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(64, 122, 13, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(64, 160, 18, 11, 0, Math.PI, Math.PI * 2); ctx.fill();

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(form.name || (lang === 'ar' ? 'الاسم الكامل' : 'Full Name'), 116, 130);

      // Interest
      ctx.fillStyle = '#16a085';
      ctx.font = '13px sans-serif';
      ctx.fillText(form.interest || (lang === 'ar' ? 'مجال التدخل' : 'Intervention Area'), 116, 152);

      // Footer divider
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, 198); ctx.lineTo(W - 30, 198); ctx.stroke();

      // Volunteer ID
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px sans-serif';
      ctx.fillText('VOLUNTEER ID', 30, 222);
      ctx.fillStyle = '#e0e0e0';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`ED-${(form.phone || '0000').slice(-4)}-2026`, 30, 242);

      // Location
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('LOCATION', W - 30, 222);
      ctx.fillStyle = '#e0e0e0';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(form.region || 'Mauritania', W - 30, 242);
      ctx.textAlign = 'left';

      // Website
      ctx.fillStyle = 'rgba(22,160,133,0.7)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('www.enderek.org', W / 2, 290);

      // Trigger download
      const link = document.createElement('a');
      link.download = `volunteer-card-${(form.name || 'volunteer').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    const img = new Image();
    img.onload = () => render(img);
    img.onerror = () => render(null);
    img.src = logoImg;
  };

  const validate = () => {
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = lang === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email';
    if (!form.phone.trim()) tempErrors.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone is required';
    if (!form.region.trim()) tempErrors.region = lang === 'ar' ? 'المنطقة مطلوبة' : 'Region is required';
    if (!form.interest) tempErrors.interest = lang === 'ar' ? 'يرجى اختيار مجال الاهتمام' : 'Please select area of interest';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitVolunteer(form);
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err.message || (lang === 'ar' ? 'حدث خطأ، حاول مجدداً.' : 'Something went wrong. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="volunteer" 
      style={{
        padding: '100px 0',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
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
            {t.volunteer.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.volunteer.subtitle}
          </p>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '16px auto 0 auto', borderRadius: '2px' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Form / Success Portal */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Full name */}
                <div className="form-group">
                  <label className="form-label">{t.volunteer.form.name}</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{
                      position: 'absolute',
                      top: '14px',
                      left: lang === 'ar' ? 'auto' : '16px',
                      right: lang === 'ar' ? '16px' : 'auto',
                      color: 'var(--text-secondary)'
                    }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{
                        paddingLeft: lang === 'ar' ? '16px' : '44px',
                        paddingRight: lang === 'ar' ? '44px' : '16px'
                      }}
                      placeholder="Ahmed Mohamed"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  {errors.name && <span style={{ color: '#E5243B', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">{t.volunteer.form.email}</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{
                      position: 'absolute',
                      top: '14px',
                      left: lang === 'ar' ? 'auto' : '16px',
                      right: lang === 'ar' ? '16px' : 'auto',
                      color: 'var(--text-secondary)'
                    }} />
                    <input 
                      type="email" 
                      className="form-control" 
                      style={{
                        paddingLeft: lang === 'ar' ? '16px' : '44px',
                        paddingRight: lang === 'ar' ? '44px' : '16px'
                      }}
                      placeholder="ahmed@example.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                  {errors.email && <span style={{ color: '#E5243B', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                </div>

                {/* Phone & Region Double Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{t.volunteer.form.phone}</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{
                        position: 'absolute',
                        top: '14px',
                        left: lang === 'ar' ? 'auto' : '12px',
                        right: lang === 'ar' ? '12px' : 'auto',
                        color: 'var(--text-secondary)'
                      }} />
                      <input 
                        type="text" 
                        className="form-control" 
                        style={{
                          paddingLeft: lang === 'ar' ? '12px' : '36px',
                          paddingRight: lang === 'ar' ? '36px' : '12px',
                          fontSize: '0.9rem'
                        }}
                        placeholder="+222 44444444"
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                      />
                    </div>
                    {errors.phone && <span style={{ color: '#E5243B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.volunteer.form.region}</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{
                        position: 'absolute',
                        top: '14px',
                        left: lang === 'ar' ? 'auto' : '12px',
                        right: lang === 'ar' ? '12px' : 'auto',
                        color: 'var(--text-secondary)'
                      }} />
                      <input 
                        type="text" 
                        className="form-control" 
                        style={{
                          paddingLeft: lang === 'ar' ? '12px' : '36px',
                          paddingRight: lang === 'ar' ? '36px' : '12px',
                          fontSize: '0.9rem'
                        }}
                        placeholder={lang === 'ar' ? 'نواكشوط، الترارزة...' : 'Nouakchott, Trarza...'}
                        value={form.region}
                        onChange={e => setForm({...form, region: e.target.value})}
                      />
                    </div>
                    {errors.region && <span style={{ color: '#E5243B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.region}</span>}
                  </div>
                </div>

                {/* Preferred Area of Intervention (Mapping to the 15 areas grouped or direct selection) */}
                <div className="form-group">
                  <label className="form-label">{t.volunteer.form.interest}</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={18} style={{
                      position: 'absolute',
                      top: '14px',
                      left: lang === 'ar' ? 'auto' : '16px',
                      right: lang === 'ar' ? '16px' : 'auto',
                      color: 'var(--text-secondary)'
                    }} />
                    <select
                      className="form-control"
                      style={{
                        paddingLeft: lang === 'ar' ? '16px' : '44px',
                        paddingRight: lang === 'ar' ? '44px' : '16px',
                        appearance: 'none',
                        background: 'rgba(0, 0, 0, 0.25) url("data:image/svg+xml;utf8,<svg fill=\'%2316a085\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat',
                        backgroundPosition: lang === 'ar' ? 'left 12px center' : 'right 12px center'
                      }}
                      value={form.interest}
                      onChange={e => setForm({...form, interest: e.target.value})}
                    >
                      <option value="" disabled style={{ background: 'var(--bg-surface)' }}>
                        {lang === 'ar' ? '-- اختر مجال تدخل --' : '-- Choose Intervention --'}
                      </option>
                      {t.interventions.list.map(item => (
                        <option key={item.id} value={item.name} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.interest && <span style={{ color: '#E5243B', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.interest}</span>}
                </div>

                {/* Experience / Motivations */}
                <div className="form-group">
                  <label className="form-label">{t.volunteer.form.experience}</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    style={{ resize: 'vertical' }}
                    placeholder="..."
                    value={form.experience}
                    onChange={e => setForm({...form, experience: e.target.value})}
                  />
                </div>

                {submitError && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', color: '#b91c1c', fontWeight: 600, fontSize: '0.88rem' }}>
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{ marginTop: '10px' }}
                >
                  {isSubmitting ? t.volunteer.form.submitting : t.volunteer.form.submit}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(22, 160, 133, 0.15)',
                  color: 'var(--emerald-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Heart size={32} fill="var(--emerald-500)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t.volunteer.form.success_title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
                    {t.volunteer.form.success_desc}
                  </p>
                </div>
                
                {/* Reset button */}
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setSubmitError('');
                    setForm({ name: '', email: '', phone: '', region: '', interest: '', experience: '' });
                  }}
                  className="btn-secondary"
                  style={{ width: 'fit-content', margin: '10px auto 0 auto' }}
                >
                  {lang === 'ar' ? 'تقديم طلب آخر' : 'Submit Another Application'}
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC DIGITAL ECO VOLUNTEER CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div 
              className="glass-panel" 
              style={{
                padding: '30px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(22, 160, 133, 0.1), rgba(15, 76, 129, 0.1))',
                border: '2px solid var(--emerald-500)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), var(--shadow-glow)',
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '1.58 / 1', // Standard ID Card proportions
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Background watermark */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: lang === 'ar' ? 'auto' : '-40px',
                left: lang === 'ar' ? '-40px' : 'auto',
                opacity: 0.05,
                transform: 'rotate(25deg)',
                pointerEvents: 'none'
              }}>
                <Award size={220} />
              </div>

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={logoImg} alt="ENDERK" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    {t.volunteer.form.card_org}
                  </span>
                </div>
                
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '4px 8px',
                  borderRadius: '10px',
                  background: isSuccess ? 'rgba(22, 160, 133, 0.2)' : 'rgba(243, 156, 18, 0.2)',
                  color: isSuccess ? '#00e699' : 'var(--gold-500)',
                  border: isSuccess ? '1px solid #00e699' : '1px solid var(--gold-500)'
                }}>
                  {isSuccess ? (lang === 'ar' ? 'متطوع رسمي' : 'Active Volunteer') : t.volunteer.form.card_status}
                </span>
              </div>

              {/* Card Center Content */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
                {/* Avatar spot */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <User size={32} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    color: form.name ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)' 
                  }}>
                    {form.name || (lang === 'ar' ? 'الاسم بالكامل' : 'Your Full Name')}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: form.interest ? 'var(--emerald-500)' : 'var(--text-secondary)' 
                  }}>
                    {form.interest || (lang === 'ar' ? 'مجال التدخل المختار' : 'Preferred Intervention Area')}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '12px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'الرمز التعريفي' : 'VOLUNTEER ID'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
                    {isSuccess ? `ED-${form.phone.slice(-4)}-2026` : 'ED-XXXX-2026'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'مقر الإقامة' : 'LOCATION'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {form.region || 'Mauritania'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mock download card CTA */}
            <button 
              className="btn-secondary" 
              disabled={!isSuccess}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                opacity: isSuccess ? 1 : 0.5,
                cursor: isSuccess ? 'pointer' : 'not-allowed'
              }}
              onClick={downloadCard}
            >
              <Download size={16} />
              <span>{lang === 'ar' ? 'تحميل بطاقة المتطوع الرقمية' : 'Download Digital Volunteer Card'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
