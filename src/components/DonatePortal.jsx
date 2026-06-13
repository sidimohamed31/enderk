import { useState } from 'react';
import { ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DonatePortal({ t, lang }) {
  const [donateType, setDonateType] = useState('one_time'); // 'one_time' or 'monthly'
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bankily'); // 'bankily', 'masrivi', 'card'
  const [phoneNum, setPhoneNum] = useState('');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationAmounts = [100, 200, 500, 1000, 2000];

  const getAmount = () => {
    return customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  // 100 MRU is:
  // - 1 tree planted
  // - 50 liters of clean water secured
  // - 5 square meters of beaches cleaned
  const amount = getAmount();
  const treesPlanted = Math.floor(amount / 100);
  const waterSecured = Math.floor(amount * 0.5);
  const beachCleaned = Math.floor(amount * 0.05);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <section 
      id="donate" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(to bottom, var(--bg-app), rgba(41, 128, 185, 0.03))',
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
            {t.donate.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.donate.subtitle}
          </p>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '16px auto 0 auto', borderRadius: '2px' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* DONATION WIZARD FORM */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Monthly or One Time toggles */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(16, 185, 129, 0.06)',
                  padding: '4px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(16,185,129,0.15)'
                }}>
                  <button
                    type="button"
                    onClick={() => setDonateType('one_time')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: donateType === 'one_time' ? 'var(--emerald-500)' : 'transparent',
                      color: donateType === 'one_time' ? 'white' : 'var(--emerald-700)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {t.donate.one_time}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonateType('monthly')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: donateType === 'monthly' ? 'var(--emerald-500)' : 'transparent',
                      color: donateType === 'monthly' ? 'white' : 'var(--emerald-700)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {t.donate.monthly}
                  </button>
                </div>

                {/* Grid of Amounts */}
                <div className="form-group">
                  <label className="form-label">{t.donate.amount_label}</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                    gap: '10px',
                    marginBottom: '14px'
                  }}>
                    {donationAmounts.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        style={{
                          background: selectedAmount === amt && !customAmount ? 'rgba(16, 185, 129, 0.12)' : '#f8fafb',
                          color: selectedAmount === amt && !customAmount ? 'var(--emerald-600)' : 'var(--text-primary)',
                          border: '1.5px solid',
                          borderColor: selectedAmount === amt && !customAmount ? 'var(--emerald-500)' : 'var(--border-strong)',
                          padding: '12px 6px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t.donate.custom_amount}
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                  />
                </div>

                {/* Payment Methods */}
                <div className="form-group">
                  <label className="form-label">{t.donate.method_label}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Bankily */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: paymentMethod === 'bankily' ? 'var(--emerald-500)' : 'var(--border-color)',
                      background: paymentMethod === 'bankily' ? 'rgba(22, 160, 133, 0.05)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'bankily'} 
                        onChange={() => setPaymentMethod('bankily')}
                        style={{ accentColor: 'var(--emerald-500)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.donate.methods.bankily}</span>
                    </label>

                    {/* Masrivi */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: paymentMethod === 'masrivi' ? 'var(--emerald-500)' : 'var(--border-color)',
                      background: paymentMethod === 'masrivi' ? 'rgba(22, 160, 133, 0.05)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'masrivi'} 
                        onChange={() => setPaymentMethod('masrivi')}
                        style={{ accentColor: 'var(--emerald-500)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.donate.methods.masrivi}</span>
                    </label>

                    {/* Credit Card */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: paymentMethod === 'card' ? 'var(--emerald-500)' : 'var(--border-color)',
                      background: paymentMethod === 'card' ? 'rgba(22, 160, 133, 0.05)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')}
                        style={{ accentColor: 'var(--emerald-500)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.donate.methods.card}</span>
                    </label>
                  </div>
                </div>

                {/* Sub-inputs based on payment type */}
                {paymentMethod === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t.donate.card_name}
                        value={cardDetails.name}
                        onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t.donate.card_num}
                        value={cardDetails.number}
                        onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t.donate.card_expiry}
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t.donate.card_cvc}
                        value={cardDetails.cvc}
                        onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group animate-fade-in">
                    <label className="form-label">
                      {lang === 'ar' ? 'رقم الهاتف المرتبط بالخدمة (أوقية)' : 'Mobile number linked to account'}
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="+222 XXXXXXXX"
                      value={phoneNum}
                      onChange={e => setPhoneNum(e.target.value)}
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting || amount <= 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '1rem',
                    padding: '14px'
                  }}
                >
                  <span>{isSubmitting ? (lang === 'ar' ? 'جاري معالجة الدفع...' : 'Processing Payment...') : t.donate.submit}</span>
                  <ArrowRight size={16} />
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
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {lang === 'ar' ? 'شكرًا لقلبك السخي!' : 'Thank you for your generous heart!'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px', lineHeight: 1.6 }}>
                    {t.donate.success}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setCustomAmount('');
                    setSelectedAmount(500);
                  }}
                  className="btn-secondary"
                  style={{ width: 'fit-content', margin: '10px auto 0 auto' }}
                >
                  {lang === 'ar' ? 'الرجوع للمحرر' : 'Donate Again'}
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC ECOLOGICAL IMPACT ESTIMATOR SIDEBAR */}
          <div className="glass-panel" style={{
            padding: '36px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(22, 160, 133, 0.05), rgba(41, 128, 185, 0.05))',
            border: '1px solid var(--emerald-500)',
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Sparkles size={24} style={{ color: 'var(--emerald-500)' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t.donate.impact_calc}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stat 1: Trees */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(22, 160, 133, 0.15)',
                  color: 'var(--emerald-500)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {treesPlanted}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.donate.impact_trees}
                </p>
              </div>

              {/* Stat 2: Clean Water */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(41, 128, 185, 0.15)',
                  color: 'var(--ocean-500)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {waterSecured}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.donate.impact_water}
                </p>
              </div>

              {/* Stat 3: Coastal Waste */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(243, 156, 18, 0.15)',
                  color: 'var(--gold-500)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {beachCleaned}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.donate.impact_waste}
                </p>
              </div>

              {/* Slogan footnote */}
              <div style={{
                marginTop: '16px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '12px',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
              }}>
                <ShieldAlert size={28} style={{ color: 'var(--emerald-500)', flexShrink: 0 }} />
                <span>
                  {lang === 'ar' 
                    ? 'هذا التقدير مبني على التكلفة الفعلية للمشروعات الميدانية. تلتزم المنظمة بالشفافية الكاملة وحوكمة التبرعات.' 
                    : 'This estimation is based on real operation costs. We guarantee full audit transparency.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
