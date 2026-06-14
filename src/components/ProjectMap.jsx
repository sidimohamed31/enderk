import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Film, Image as ImageIcon, Info, MapPin, X } from 'lucide-react';
import { fetchProjects, peekProjectsCache } from '../lib/projectsApi';
import { getRegionLabel, groupProjectsByRegion } from '../data/projectsData';
import { localize } from '../lib/localize';

// Real Mauritania outline path from simplemaps.com (CC-licensed)
// viewBox: 0 0 1000 1000
const MAURITANIA_PATH =
  'M653 45.5l13.4 8.8 13.3 8.8 13.4 8.8 13.3 8.8 13.4 8.8 13.3 8.8 13.4 8.8 13.3 8.7 13.3 8.8 13.4 8.7 13.3 8.8 13.4 8.7 11.3 7.4 11.3 7.4 11.3 7.3 9.7 6.3 1.6 1.1 8.2 5.3 11.7 8 11.7 8 11.7 8 11.7 7.9-14.9 0-15 0.1-14.9 0-14.9 0-15 0-14.9 0-14.9 0-15 0 0.7 5.9 0.6 5.9 0.7 6 0.6 5.9 0.7 5.9 0.6 5.9 0.7 5.9 0.6 5.9 0.7 6 0 0.4 0.5 4.6 1.1 10 1.1 10.1 0.4 4.5 1 8.9 0.9 8.9 1 8.9 1 8.9 0.9 8.9 1 8.8 0.2 1.9 0.7 7 1 8.8 0.9 8.8 1 8.8 0.9 8.9 1 8.8 0.9 8.8 1 8.8 0.9 8.7 1 8.8 0.9 8.8 1 8.8 0.9 8.7 1 8.8 0.9 8.7 1 8.7 0.9 8.8 1 8.7 0.5 4.2 1 9.3 1 9.3 0.4 4.2 0.9 7.8 1 9 0.9 9 1 9 1 8.9 1 9 0.9 9 1 8.9 1 9 1 9.8 0.4 4.2 0.4 4.1 0.5 4.2 0.4 4.2 0.7 6.6 0.7 6.6 0.7 6.6 0.7 6.6 0.6 6.6 0.7 6.6 0.7 6.6 0.7 6.6 0.7 6.6 0.7 6.6 0.7 6.6 0.6 6.5 0.7 6.4 0.7 6.4 0.7 6.4 0.6 6.4 0.7 6.4 0.7 6.4 0.6 6.3 0.7 6.4 0.7 6.4 0.6 6.4 0.7 6.3 0.7 6.4 0.6 6.3 0.7 6.4 0.7 6.4 0.6 6.3 0.3 2.8 0.6 1.2 0.6 1.1 2.7 1.8 2.4 1.8 3 2 2.7 1.9 2.8 1.9 2.7 1.9 0.3 0.4 0.3 0.3 0.1 0.5 0 0.4-0.3 2.1-1.3 6.6-1.2 6.7-1.2 6.6-1.3 6.7-1.2 6.8-1.3 6.8-1.3 6.8-1.2 6.8-0.1 0.3 0 0.3-0.1 0.1 0 0.3-0.1 0.3 0 0.1 0 0.1-0.1 0-0.1 0-0.1 0-10.6 0-9.1 0-4.2 0-4.6 0-4.9 0-5.2-0.1-9 0-6.7 0-3 0-10.2 0-10.6 0-11 0-11.3 0-11.5 0-11.5 0-11.6 0-11.5 0-11.2 0-11.1 0-10.6 0-10.2 0-9.7 0-9 0-5.7 0-5.4 0-5 0-4.6 0-6.2 0-1.1 0-8.2 0-2.4 0-11.6 0 0.4-6.4 0.9-4.8-0.2-2.3-1.6-0.7-1.3 0.8-4.2 5-1 1.9 0 2 1.1 4.4 0.8 3.9-16.7 0.7-3.3 0.7-1.4 0.6-3.8 2.2-2.5 0.7-7.9-0.7-7.8 1.1-2.7-0.1-1.6-0.4-2.5-1.6-1.3-0.7-0.6 0-1.2 0.2-0.6 0-5.8-2.3-0.9-0.1-3.2 0.2-1.9-0.3-6.9-0.2-1 0.2-1.3-0.3-1.1 0.2-2.3 0.8-0.2 0.1-1.3 0.1-2.8 0-4.1-0.6-1.1 0-0.7 0.8-0.3 1.3 0.1 2.9-0.5 1.5-0.5 0.5-1.1 0.6-0.8 1.2-0.5 0.1-0.7 0-0.7 0.2-1.1 1.1-0.5 1.2-0.7 2.5-0.7 1.2-1.8 1.7-0.6 1.2-1.1 3.9-0.6 1.2-2.2-3.4-2.5-2.5-1.8-3.6-2.2-2.2-17.1-12.6-1.3-1.5-6.2-9.1-1.7-1.5-1.6-0.6-3.8-0.8-0.6 0-0.2 0.1 0.1 0.3 0.2 0.2 0.2 0.2 0.3 0.1 0.1 0.4 0.1 0.3-0.1 0.4-0.1 0.4-0.6 0.6-0.8 0.4-1.8 0.6-1.1 0.6-2.4 2.6-2 1-1.8-0.1-1.8-0.6-0.3-0.1-1.7-0.2 0 2.4-0.2 0.7-1.7 1.9-0.9 2.3-1 4.9-2.3 4.9-0.3 1.1-0.3 3.4-1.3 3.7-0.2 1.5 0.1 0.6 0.2 1-0.1 0.7-0.8 2.8-0.1 2.1-0.1 0.4 0.6 0.5 0.5-0.2 0.3-0.3 0.5 0 0.7 0.6 0.5 0.8 0.2 1-0.1 1.3-0.5 1.1-0.4 1.2-0.3 2.5 0 0.5 0.2 0.3 0.5 0.6 0 0.5-0.4 0.2-0.5 0.2-0.2 0.1-0.3 0.3-0.3 0.4-0.4 0.4-0.2 0.7-0.6 0.9-1 0.9-1.2 0.6-2.7 0.6-1 0.9-1.6 2.2-1.1 0.8-1.4 0.4-1.3 0-1.3-0.3-0.5 0.3-0.3 1.1-0.6 0.8-0.7-0.3-2.9-2.6-1-0.6-1.4 0.3-2.9 1-1.5 0.2-1.5-0.2-1.1-0.6-3.8-2.9-4.2-2-1.2-1-2.3-2.8-0.9-0.5 0-0.8-1.6-5.5-0.3-0.7-0.6-0.7-0.7-0.4-1.6-0.4-0.7-0.4-1.2-0.9-3.7-2.2-0.9-1.1-0.5-0.5-0.7-0.3-1 0.2-2.1 0.7-0.7 0.1-0.1 0-1.8-0.8-2-1.9-0.5-0.6-1.7-0.5-0.1-0.2-0.2-0.6 0-0.6 0.3-1.8 0-0.5-0.2-0.6-0.3-0.4-0.6-0.5-0.7-0.2-0.7 0-1.5 0.3-0.6 0-0.6-0.2-0.6-0.5-1.5-1.5-0.4-0.9 0.7-0.5 2.3 0.2 1.1-0.2 0.3-0.9-0.4-1.2-0.9-0.9-4-2.7-0.8-0.9-0.6-1.1-0.2-1.1 0-2.4-0.1-0.5-0.3-0.5-0.7-0.9-0.2-0.5-0.3-2-0.2-0.6-0.5-0.5-1-0.5-1.1 0.2-1 0.5-0.9 0.7-1 0.7-0.9 0.1-2.1-0.5-0.4-0.3-0.2-0.7-0.2-0.6 0-0.6 0.4-2.6-0.2-1-0.4-0.8-0.8-0.7-0.8-0.5-1.6-0.4-0.4-0.2-1.3-0.9-0.5-0.2-1-0.1-2 0.4-1 0-0.6-1.7-0.1-0.6 0-0.6 0.3-0.6 1-1.6 0.1-0.5-0.1-0.5-0.2-0.6-0.8-1.1-0.5-0.5-0.5-0.5-1-0.6-0.5-0.3-0.4-0.5 0-0.6 0.1-0.6 0.2-0.6 0.2-0.6 0-1.4-0.4-1.1-0.6-1.1-1.2-1.5-0.3-0.4-0.1-0.5 0-0.5 0.2-1.2 0.1-0.6-0.2-0.6-0.4-0.5-1.7-1.3-0.6-0.7-0.5-0.6-0.4-0.8-0.9-2.3-0.1-0.6-0.1-1.2-0.2-0.5-0.4-0.5-1.8-1.3-0.4-0.4-0.5-0.9-0.3-0.4-1.1 0-2.4 0.9-0.7-0.5 0.1-1 1.2-2.2-0.2-1-0.4 0-0.4 0-0.4 0.1-0.9 0.4-3.5 0.7-2.1 0.9-0.5 0.2-0.2 0-1.3 0-0.4 0.1-1.8 1-0.5 0.1-0.4-0.1-0.2-0.1-0.4-0.4-0.2-0.1-0.4-0.1-0.2-0.1-0.1-0.1-0.1-0.3-0.1-0.1-0.3-0.2-0.7-0.3-0.3-0.2-0.2-0.7 0.3-1 0.4-1.1 0.1-0.9-0.6-0.1-0.7 0-0.5 0.2-0.6 0.3-0.5 0.5-1.2 1.8-0.5 0.5-1.1 0.8-1.1 0.7-0.5 0.2-0.6 0-0.5-0.1-0.6-0.4-0.6-0.5-0.4-0.7-0.3-0.6-0.6-1.9-0.3-0.6-0.5-0.5-1-0.8-0.6-0.3-2.6-0.8-1.2-0.6-0.2-1.1 0.3-1.3 0-0.6-0.3-0.6-0.7-0.9-0.1-0.5 0.1-0.6 0.4-1 0-0.5-0.4-0.5-0.6-0.4-1.4-0.5-0.6-0.4-1.1-1.4-0.5-0.4-2.2-1.3-4-3.7-2.3-2.7-1.6-1.1-0.5-0.4-1.1-1.6-0.6-0.3-0.8-0.1-1.6-0.1-0.7-0.4-0.3-0.5-0.1-1.3-0.2-0.5-0.7-0.3-2.6 0.2-0.6-0.3-0.1-0.5 0.3-1.4 0.1-0.7-0.3-0.6-0.6-0.3-4.2-1.7-1.3 0.1-0.7 0.2-1.8 1.1-0.6 0.3-0.7 0.2-0.8 0.1-0.7 0-2.7-0.6-0.7 0-2.9 0.8-0.7 0-0.8-0.1-1.8-0.9-0.6-0.2-0.7 0.1-2.3 0.6-0.8 0-11.5-0.8-2 0.5-1.3-0.2-0.7-0.9-0.5-1-0.1-0.1-0.8-1-0.8-0.4-1.5 0.7-0.7 0.4-0.4 0.7-0.3 1-0.1 0.4-0.3 0.5-0.5 0.3-0.4 0.2-0.5 0-0.5-0.1-0.7-0.7-0.6-0.8-0.6-0.7-0.9-0.3-1 0.3-0.6 0.7-0.1 0.9 0.4 0.9 1.1 1.1 0.2 0.4 0 0.6-0.3 0.4-0.5 0.2-1.4 0.6-7.2 1.1-1.1 0.1-3.2-0.5-2.2 0-1 0.3-2.9 1.2-0.9 0.2-1 0-0.8-0.3-0.5-0.7-0.4-0.7-0.6-0.5-1-0.1-1 0.4-0.8 0.8-1.7 2.3-0.6 0.6-0.8 0.4-1 0.1-2.9-0.6-1.1 0.2-0.8 0.5-1.4 1.4-1 0.6-1 0.3-1 0.1-1.1-0.3-1.6-0.8-0.5-0.1-2.2-0.2-3.1-1-1 0-1.7 0.3-0.6 0-2.3-0.6-1 0.1-2.7 1.2-0.5 0.1-0.4 0-0.9-0.4-0.5-0.1-0.5 0.1-0.5 0.2-0.5 0.4-1.6 0.2-1.5-0.2-1.4-0.6-1.1-1.3-0.8-1.2-0.5-0.5-0.7-0.4-0.8-0.2-0.8 0.2-0.8 0.4-2 1.4-0.7 0.3-0.7 0.1-0.8 0-2.2-0.4-1.5 0.3-1.5 0.9-1.2 1.2-1 1.3-0.5 1.3-0.3 2.8-2.8 11.9-0.3 0.8-0.4 0.7-1.1 0.7-2.4 0.6-1 0.9-0.5 1.4-0.3 4.8-1.2 2.8-0.9 3.1-0.4 0.8-0.2 7.6-0.6 3.9-1.6 2.6 1.1-11.8-0.2-6.2-0.6-14.1 0.6-4.6 0.5-1.3 1.9-3.6 0.5-3.5 0.6-1 0.7-1.9 0-7.6 0.5-3 5.4-13.9 1.5-2.4 1-4.7 1.1-2.4 3.3-4.6 5.7-12.6 0.4-1.7 1-1.3 6.3-20 2-8.6 0.5-9.5 1.2-11.3-0.8-12.9-2.3-24.3-0.7-2.5-3.5-7.8-1.6-8.8-1.1-2.9 0.6-1.7-0.2-1.9-2.6-9.9-0.4-1-1.9-4.6-3-5-3.9-4.6-1.3-1.2-0.3-0.2-0.2-0.5-0.6-0.1-0.6-0.1-0.6-0.3-1.2-0.7-2.6-0.8-1.1-0.7-0.5-0.8-1.1-3-0.2-1.3-0.7-1.3-1.3-1.2-0.8-1 0.9-1.2 3.9 1.1 3.8-0.5 3.3-1.9 2.4-3.1 1.6-2.7 0.4-1.4 0.6-1 0.1-0.4-0.2-0.5-0.4-0.3-0.5 0-0.2 0.2-0.3 0-3.8 4.2-1.9 1.5 2.8-5.9-1 0.5-2.7 2.3-1 1.1-0.4 0.7-0.4 0.8-0.2 0.8 0.4 0.9 0 0.4-0.6 1.4-0.2 0.6-0.1 0.3-0.4 0.1-0.5 0-0.3-0.1-0.3-0.2-0.1-0.1 0-0.2-0.1-0.5-0.1-0.5 0-1.8 0.1-0.6 0.6-1.1 1.8-1.9 0.4-1.2 0.2-1.5 0.7-0.7 0.9-0.6 1-0.9 6.4-9.8 0.4-0.4 0.5-0.2 0.4-0.4 0.1-0.7 0.1-1.4 0.2-0.6 0.4-0.2 0.2-0.3 1.1-1.3 0.4-0.4 0-0.8-0.2-0.6-0.3-0.6-0.5-0.4 0.5-0.5 0.4-0.6 0.1-0.6 0-0.8-1.1 0.6-0.4 0.4-0.2-1.1 1-1.8-0.3-1-1.3-0.8-0.8 0.6-0.5 1.1-0.2 0.5-1.1 0.7-0.5-0.3 0-0.9 0.2-0.9 0.4-0.8 0.4-0.6 4-4.1 1.1-1.7 0.6-2.2-0.3-1.7-2-3.7-0.9-1.9 0.5 0 0.5 0 0.5-0.2 0.4-0.4 1.4-2.3 0.6-1.4 0.2-1.4-0.1-1.3-0.5-1.1-1.9-3-0.4-0.2-1-0.1-0.6-0.3-0.3-0.7-0.2-0.7-0.3-0.3-1.1-0.6-1.9-4.8-0.6-0.6-0.6-0.4-0.4-0.5-0.2-0.7 0.2-0.3 0.4-0.1 0.2-0.2-0.1-0.4-0.2-0.3-0.4-0.9-0.3-1.3-2.6-6.7-0.6-1-1-0.4-0.6-0.9-0.1-1.8-0.3-1.3-1.1 0.5-1.4-0.9 0-0.5 3.1-0.9 0.9-0.4-1.4-0.2-2.4 0.4-1.1-0.2-0.9-1.2 0.5-0.5-1-2-0.4-0.3-1.5-0.7-0.4 3.2 0.5 7-1 2.7-0.6-1.1-0.9-0.8-1.7-1.1-0.6-0.6-0.8-1.7-0.7-0.9-0.8-0.6-2.1-1.1-0.5-0.5-0.1-0.8 0.3-0.4 0.4-0.1 0.3-0.2 0-0.6-0.4-0.6-0.1-0.5-0.3-1.1-0.8-0.9-1.9-1.5-0.2-0.5 0-1.4-0.3-0.6-1.1-1.2-0.8-3.4-0.4-0.8-0.7-0.9-0.4-1.1-0.3-1.1-0.2-1.1-0.2 0.4-0.5 0.3-0.2 0.3-1-1-0.3-1.1-0.2-1.1-0.4-1.3-0.4-0.5-0.6-0.5-0.6-0.7-0.2-1-0.4-0.7-1.6-2.3-0.3-1-0.2-1-0.3-1.1-0.9-2.1-1.3-1.6-0.9 0.6-1.7 3.3-2.9 3.9-0.7 0.6-0.4 0.9 0.5 1.2 0.8-0.3 0 1.2-0.4 2.6-0.1 2.4-0.3 0.6-0.6 0.4-1.6 0.5-0.6 0.6 0 0.6 0.3 0.6 0.7 0.7 0.5 1.2 0 0.4-0.1 0.9-0.6 3.1-0.6 1.5-0.7 0.8-1.6-7.7 0.3-2.2 1.5-6.6 0.5-2.3 2.8-8.2 1.3-7 1.2-6.3 0.7-0.6 7.8 0 2.8 0 7.8 0 12.3 0 15.9 0 18.8 0 20.9 0 22.5 0 23.1 0 23.2 0 22.4 0 2.1 0 18.9 0 18.7 0 15.9 0 12.3 0 7.8 0 2.8 0 9.9 0-0.7-11.7-0.4-6.3-1.9-30-1.1-18.2-1.2-18.3-0.8-4.7-3.3-9.4-0.7-4.7 0.9-4.9 2.2-4.6 5.7-8.2 1.3-1.7 6.8-4.7 8.4-5.8 7.3-5.1 4.2-2.9 4.1-1.5 11.4-1.6 2.4-0.7 14.8-7.1 6.9-1.9 0.9-1.2 0.2-2.5 0-6 0-5.5 0-5.6 0-5.6 0-5.5 0-5.6 0-5.6 0-5.6 0-5.6 0-5.6 0-5.6 0-5.5 0-5.6 0-5.6 0-5.7 0-5.6 0-5.6 0-5.6 0-5.6 0-5.6 0-5.7 0-5.6 0-5.6 0-5.7 0-5.6 0-5.7 0-5.6 0-5.7 0-5.6 0-5.7 0-5.6 0-5.7 0-5.7 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.7 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.8 0 6.7 0 6.8 0 6.8 0 6.8 0 5.7 0 1.4-0.4 0.4-0.9 0-3.4 0-1.1 0-2.9 0-4.5 0-5.9 0-7 0-7.8 0-8.4 0-8.6 0-8.7 0-8.3 0-7.9-0.1-7 0-6 0-4.5 0-3 0-1z';

function formatProjectDate(value, lang) {
  if (!value) return '';

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  const locale = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export default function ProjectMap({ t, lang }) {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [hoveredRegionId, setHoveredRegionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    // Serve stale data instantly — no spinner on repeat visits
    const stale = peekProjectsCache();
    if (stale) {
      setProjects(stale);
      setSelectedProjectId(stale[0]?.id || null);
      setIsLoading(false);
    }

    // Always fetch fresh in background
    fetchProjects()
      .then((data) => {
        if (!isMounted) return;
        setProjects(data);
        setSelectedProjectId((id) => id || data[0]?.id || null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!stale) {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  );

  const groupedProjects = useMemo(() => groupProjectsByRegion(projects), [projects]);

  const getLabel = (pin) => {
    if (lang === 'ar') return pin.label_ar;
    if (lang === 'fr') return pin.label_fr;
    return pin.label_en;
  };

  const selectProject = (project) => {
    setSelectedProjectId(project.id);
    setActiveMedia(null);
  };

  return (
    <section
      id="map"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(to bottom, rgba(22, 160, 133, 0.02), var(--bg-app))',
        position: 'relative',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            {t.map_section.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '720px', margin: '8px auto 0' }}>
            {t.map_section.subtitle}
          </p>
          <div style={{ width: '80px', height: '4px', background: 'var(--emerald-500)', margin: '16px auto 0', borderRadius: '2px' }} />
        </div>

        {isLoading ? (
          <div
            className="glass-panel"
            style={{
              padding: '48px',
              borderRadius: '28px',
              textAlign: 'center',
              background: 'rgba(240, 253, 248, 0.6)',
              border: '2px dashed rgba(16, 185, 129, 0.24)',
            }}
          >
            <Info size={34} style={{ marginBottom: '12px', color: 'var(--emerald-600)' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px' }}>Loading projects</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              We’re fetching the latest published projects from the backend.
            </p>
          </div>
        ) : error ? (
          <div
            className="glass-panel"
            style={{
              padding: '48px',
              borderRadius: '28px',
              textAlign: 'center',
              background: 'rgba(254, 242, 242, 0.8)',
              border: '2px dashed rgba(239, 68, 68, 0.24)',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px', color: '#b91c1c' }}>Could not load projects</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '48px',
              borderRadius: '28px',
              textAlign: 'center',
              background: 'rgba(240, 253, 248, 0.6)',
              border: '2px dashed rgba(16, 185, 129, 0.24)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.08)',
                color: 'var(--emerald-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Info size={34} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px' }}>No projects published yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Open the hidden admin page and add your first project. Once saved, it will appear here with its photos, video, and map pin.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(320px, 1.1fr)',
              gap: '28px',
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {projects.map((project) => {
                  const isActive = selectedProject?.id === project.id;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => selectProject(project)}
                      style={{
                        textAlign: 'start',
                        border: `1px solid ${isActive ? 'rgba(16,185,129,0.55)' : 'rgba(16,185,129,0.12)'}`,
                        background: isActive ? 'rgba(16, 185, 129, 0.08)' : 'white',
                        borderRadius: '22px',
                        padding: '18px',
                        boxShadow: isActive ? 'var(--shadow-glow)' : 'var(--shadow-soft)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '84px',
                            height: '84px',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            background: 'var(--bg-surface-alt)',
                            flexShrink: 0,
                          }}
                        >
                          {project.images[0] ? (
                            <img src={project.images[0]} alt={localize(project, 'title', lang)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
                              {getRegionLabel(project.regionId, lang)}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {project.images.length} photo{project.images.length === 1 ? '' : 's'}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.04rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.25 }}>{localize(project, 'title', lang)}</h3>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.55 }}>
                            {(() => { const d = localize(project, 'description', lang); return d.length > 130 ? `${d.slice(0, 130)}...` : d; })()}
                          </p>

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                            <span
                              style={{
                                padding: '5px 10px',
                                borderRadius: '999px',
                                background: 'rgba(16, 185, 129, 0.08)',
                                color: 'var(--emerald-700)',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                              }}
                            >
                              {localize(project, 'category', lang)}
                            </span>
                            {project.projectDate && (
                              <span
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '999px',
                                  background: 'rgba(59, 130, 246, 0.08)',
                                  color: 'var(--ocean-600)',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Calendar size={12} />
                                {formatProjectDate(project.projectDate, lang)}
                              </span>
                            )}
                            {project.videoUrl && (
                              <span
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '999px',
                                  background: 'rgba(59, 130, 246, 0.08)',
                                  color: 'var(--ocean-600)',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                }}
                              >
                                Video
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  minHeight: '540px',
                  overflow: 'visible',
                }}
              >
                <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{ maxWidth: '560px', maxHeight: '560px', overflow: 'visible' }}>
                  <path
                    d={MAURITANIA_PATH}
                    style={{
                      fill: 'rgba(16, 185, 129, 0.12)',
                      stroke: 'rgba(16, 185, 129, 0.45)',
                      strokeWidth: '2.5',
                      transition: 'fill 0.3s ease',
                    }}
                  />

                  {groupedProjects.map(({ pin, projects: pinProjects }) => {
                    const isActive = selectedProject && selectedProject.regionId === pin.id;
                    const isHovered = hoveredRegionId === pin.id;
                    const highlight = isActive || isHovered;
                    const label = pinProjects.length > 1 ? `${getLabel(pin)} (${pinProjects.length})` : getLabel(pin);

                    return (
                      <g
                        key={pin.id}
                        onClick={() => selectProject(pinProjects[0])}
                        onMouseEnter={() => setHoveredRegionId(pin.id)}
                        onMouseLeave={() => setHoveredRegionId(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={highlight ? 22 : 16}
                          fill={highlight ? 'rgba(22, 160, 133, 0.3)' : 'rgba(22, 160, 133, 0.15)'}
                          className="animate-pulse-ring"
                        />
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={highlight ? 12 : 8}
                          fill={highlight ? 'var(--emerald-500)' : 'rgba(22, 160, 133, 0.6)'}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle cx={pin.x} cy={pin.y} r={highlight ? 5 : 3} fill="white" />

                        {highlight ? (
                          <g>
                            <rect
                              x={pin.x - 70}
                              y={pin.y - 40}
                              width="140"
                              height="22"
                              rx="6"
                              fill="rgba(255, 255, 255, 0.95)"
                              stroke="var(--emerald-500)"
                              strokeWidth="1.5"
                              filter="drop-shadow(0 2px 6px rgba(0,0,0,0.10))"
                            />
                            <text
                              x={pin.x}
                              y={pin.y - 25}
                              textAnchor="middle"
                              fill="var(--emerald-700)"
                              style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-arabic)' }}
                            >
                              {label}
                            </text>
                          </g>
                        ) : (
                          <text
                            x={pin.x}
                            y={pin.y + 22}
                            textAnchor="middle"
                            fill="rgba(6, 95, 70, 0.55)"
                            style={{ fontSize: '9px', fontFamily: 'var(--font-arabic)', pointerEvents: 'none' }}
                          >
                            {getLabel(pin)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {selectedProject ? (
                <div
                  className="glass-panel animate-fade-in"
                  style={{
                    padding: '32px',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    borderColor: 'var(--emerald-500)',
                    position: 'relative',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: lang === 'ar' ? 'auto' : '16px',
                      left: lang === 'ar' ? '16px' : 'auto',
                      background: 'rgba(249,250,251,0.8)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    <X size={16} />
                  </button>

                  <div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--emerald-500)',
                        letterSpacing: '1px',
                      }}
                    >
                      {getRegionLabel(selectedProject.regionId, lang)} • {localize(selectedProject, 'category', lang)}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '6px' }}>{localize(selectedProject, 'title', lang)}</h3>
                    {selectedProject.projectDate && (
                      <p
                        style={{
                          marginTop: '8px',
                          color: 'var(--text-secondary)',
                          fontSize: '0.88rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Calendar size={14} />
                        {lang === 'ar'
                          ? `تاريخ المشروع: ${formatProjectDate(selectedProject.projectDate, lang)}`
                          : lang === 'fr'
                            ? `Date du projet: ${formatProjectDate(selectedProject.projectDate, lang)}`
                            : `Project date: ${formatProjectDate(selectedProject.projectDate, lang)}`}
                      </p>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{localize(selectedProject, 'description', lang)}</p>

                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'rgba(22, 160, 133, 0.06)',
                      border: '1px dashed rgba(22, 160, 133, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <CheckCircle size={18} style={{ color: 'var(--emerald-500)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      <strong>{t.map_section.impact_label}</strong>
                      {localize(selectedProject, 'impact', lang)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActiveMedia(activeMedia === 'video' ? null : 'video')}
                      className="btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem', padding: '11px' }}
                    >
                      <Film size={15} />
                      {lang === 'ar' ? 'شاهد الفيديو' : lang === 'fr' ? 'Voir la vidéo' : 'Watch Video'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMedia(activeMedia === 'photos' ? null : 'photos')}
                      className="btn-secondary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem', padding: '9px', color: 'var(--text-primary)' }}
                    >
                      <ImageIcon size={15} />
                      {lang === 'ar' ? 'معرض الصور' : lang === 'fr' ? 'Photos' : 'Photos'}
                    </button>
                  </div>

                  {activeMedia && (
                    <div
                      className="animate-fade-in"
                      style={{
                        background: 'rgba(240, 253, 248, 0.9)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: '1px solid rgba(16,185,129,0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          {activeMedia === 'video' ? t.map_section.video_title : t.map_section.images_title}
                        </span>
                        <button type="button" onClick={() => setActiveMedia(null)} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <X size={13} />
                        </button>
                      </div>

                      {activeMedia === 'video' ? (
                        selectedProject.videoUrl ? (
                          <div style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                            <video
                              src={selectedProject.videoUrl}
                              controls
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            />
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.map_section.no_video}</div>
                        )
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                          {selectedProject.images.length > 0 ? (
                            selectedProject.images.map((img, idx) => (
                              <div key={`${selectedProject.id}-${idx}`} style={{ borderRadius: '8px', overflow: 'hidden', height: '110px', cursor: 'zoom-in' }}>
                                <img
                                  src={img}
                                  alt={`${localize(selectedProject, 'title', lang)}-${idx}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                  onClick={() => window.open(img, '_blank')}
                                  onMouseEnter={(event) => {
                                    event.currentTarget.style.transform = 'scale(1.08)';
                                  }}
                                  onMouseLeave={(event) => {
                                    event.currentTarget.style.transform = 'scale(1)';
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.map_section.images_title}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="glass-panel"
                  style={{
                    padding: '50px 40px',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '20px',
                    minHeight: '350px',
                    background: 'rgba(240, 253, 248, 0.5)',
                    border: '2px dashed rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(22, 160, 133, 0.05)',
                      color: 'var(--emerald-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MapPin size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{t.map_section.select_region}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.6 }}>
                      {lang === 'ar'
                        ? 'اختر أي بطاقة منشورة أو أي نقطة مضيئة على الخريطة لعرض التفاصيل والصور والفيديو.'
                        : lang === 'fr'
                          ? 'Select a published card or a glowing map pin to see its media.'
                          : 'Select a published card or a glowing map pin to see its media.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
