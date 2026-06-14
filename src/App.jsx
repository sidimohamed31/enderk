import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import NewsSection from './components/NewsSection';
import AboutUs from './components/AboutUs';
import Interventions from './components/Interventions';
import ProjectMap from './components/ProjectMap';
import VolunteerForm from './components/VolunteerForm';
import DonatePortal from './components/DonatePortal';
import Contact from './components/Contact';
import MapAdmin from './components/MapAdmin';
import { translations } from './data/translations';

function App() {
  const [lang, setLang] = useState('ar');

  const t = translations[lang] || translations.ar;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.style.colorScheme = 'light';
  }, [lang]);

  return (
    <Routes>
      <Route path="/admin" element={<MapAdmin />} />
      <Route element={<Layout lang={lang} setLang={setLang} t={t} />}>
        <Route path="/" element={<><Hero t={t} lang={lang} /><StatsSection t={t} lang={lang} /><NewsSection t={t} lang={lang} /></>} />
        <Route path="/about" element={<AboutUs t={t} lang={lang} />} />
        <Route path="/interventions" element={<Interventions t={t} lang={lang} />} />
        <Route path="/map" element={<ProjectMap t={t} lang={lang} />} />
        <Route path="/volunteer" element={<VolunteerForm t={t} lang={lang} />} />
        <Route path="/donate" element={<DonatePortal t={t} lang={lang} />} />
        <Route path="/contact" element={<Contact t={t} lang={lang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
