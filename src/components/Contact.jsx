import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact({ t, lang }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <section 
      id="contact" 
      style={{
        padding: '100px 0',
        background: 'var(--bg-app)',
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
            {t.contact.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            {t.contact.subtitle}
          </p>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '16px auto 0 auto', borderRadius: '2px' }} />
        </div>

        {/* Form and info split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact info grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>{t.contact.info_title}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Address */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(22, 160, 133, 0.1)',
                    color: 'var(--emerald-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {t.contact.address_label}
                    </span>
                    <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>
                      {t.contact.address}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(41, 128, 185, 0.1)',
                    color: 'var(--ocean-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {t.contact.email_label}
                    </span>
                    <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>
                      contact@enderek.org
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(22, 160, 133, 0.1)',
                    color: 'var(--emerald-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {t.contact.phone_label}
                    </span>
                    <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px', direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      +222 31 44 80 80
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="glass-panel" style={{
              height: '220px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <iframe
                title="ENDERK Location"
                src="https://www.google.com/maps?q=18.1075931,-15.9731837&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form Panel */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.volunteer.form.email}</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.contact.form.subject}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t.contact.form.message}</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    required
                    style={{ resize: 'vertical' }}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px'
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.contact.form.submit}</span>
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
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
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {lang === 'ar' ? 'تم استلام رسالتك!' : 'Message Received!'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px' }}>
                    {t.contact.form.success}
                  </p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="btn-secondary"
                  style={{ width: 'fit-content', margin: '10px auto 0 auto' }}
                >
                  {lang === 'ar' ? 'إرسال رسالة جديدة' : 'Send Another Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
