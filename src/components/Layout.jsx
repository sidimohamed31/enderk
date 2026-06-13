import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ lang, setLang, t }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar lang={lang} setLang={setLang} t={t} />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer t={t} lang={lang} />
    </div>
  );
}
