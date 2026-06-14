export const mouqataasData = {
  nouakchott:   ['Dar Naim', 'Toujounine', 'Teyaret', 'Tevragh Zeina', 'Ksar', 'Sebkha', 'Arafat', 'El Mina', 'Riyad'],
  nouadhibou:   ['Nouadhibou', 'Chami'],
  trarza:       ['Rosso', 'Keur Macène', 'Boutilimit', 'Oued Naga', 'Mederdra', 'Rkiz', 'Tékane'],
  brakna:       ['Aleg', 'Boghé', 'Magta Lahjar', 'Bababé', "M'Bagne", 'Malé'],
  guidimagha:   ['Sélibabi', 'Ould Yenge', 'Ghabou', 'Wompou'],
  gorgol:       ['Kaédi', 'Maghama', "M'Bout", 'Monguel', 'Lexeiba I'],
  assaba:       ['Kiffa', 'Barkeol', 'Boumdeid', 'Guerou', 'Kankossa'],
  adrar:        ['Atar', 'Aoujeft', 'Chinguetti', 'Ouadane'],
  inchiri:      ['Akjoujt', 'Bennichab'],
  tagant:       ['Tidjikja', 'Moudjéria', 'Tichit'],
  hodh_gharbi:  ['Aioun el Atrouss', 'Tintane', 'Kobenni', 'Tamcheket'],
  hodh_chargui: ['Néma', 'Adel Begrou', 'Amourj', 'Bassiknou', 'Diguenni', 'Oualata', 'Timbedra', 'Dhar'],
  tiris:        ['Zouerate', 'Fdérik', 'Bir Moghrein'],
};

export const regionPins = [
  { id: 'nouakchott', x: 161, y: 716, label_ar: 'نواكشوط', label_fr: 'Nouakchott', label_en: 'Nouakchott' },
  { id: 'nouadhibou', x: 90, y: 514, label_ar: 'نواذيبو', label_fr: 'Nouadhibou', label_en: 'Nouadhibou' },
  { id: 'trarza', x: 175, y: 826, label_ar: 'الترارزة', label_fr: 'Trarza', label_en: 'Trarza' },
  { id: 'brakna', x: 247, y: 842, label_ar: 'البراكنة', label_fr: 'Brakna', label_en: 'Brakna' },
  { id: 'guidimagha', x: 348, y: 924, label_ar: 'كيديماغا', label_fr: 'Guidimagha', label_en: 'Guidimagha' },
  { id: 'gorgol', x: 328, y: 855, label_ar: 'گورگول', label_fr: 'Gorgol', label_en: 'Gorgol' },
  { id: 'assaba', x: 420, y: 818, label_ar: 'لعصابه', label_fr: 'Assaba', label_en: 'Assaba' },
  { id: 'adrar', x: 358, y: 545, label_ar: 'آدرار', label_fr: 'Adrar', label_en: 'Adrar' },
  { id: 'inchiri', x: 180, y: 645, label_ar: 'إينشيري', label_fr: 'Inchiri', label_en: 'Inchiri' },
  { id: 'tagant', x: 460, y: 672, label_ar: 'تگانت', label_fr: 'Tagant', label_en: 'Tagant' },
  { id: 'hodh_gharbi', x: 600, y: 800, label_ar: 'الحوض الغربي', label_fr: 'Hodh El Gharbi', label_en: 'Hodh El Gharbi' },
  { id: 'hodh_chargui', x: 748, y: 818, label_ar: 'الحوض الشرقي', label_fr: 'Hodh El Chargui', label_en: 'Hodh El Chargui' },
  { id: 'tiris', x: 540, y: 338, label_ar: 'تيرس زمور', label_fr: 'Tiris Zemmour', label_en: 'Tiris Zemmour' },
];

const REGION_LOOKUP = new Map(regionPins.map((pin) => [pin.id, pin]));

export const getRegionLabel = (regionId, lang = 'en') => {
  const region = REGION_LOOKUP.get(regionId);
  if (!region) return '';

  if (lang === 'ar') return region.label_ar;
  if (lang === 'fr') return region.label_fr;
  return region.label_en;
};

export const groupProjectsByRegion = (projects) => {
  const buckets = new Map();

  projects.forEach((project) => {
    if (!project.regionId) return;
    const existing = buckets.get(project.regionId) || [];
    buckets.set(project.regionId, [...existing, project]);
  });

  return regionPins
    .map((pin) => ({
      pin,
      projects: buckets.get(pin.id) || [],
    }))
    .filter((entry) => entry.projects.length > 0);
};

