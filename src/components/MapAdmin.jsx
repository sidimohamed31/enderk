import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Calendar, Eye, FileImage, Globe,
  Newspaper, PencilLine, Plus, Save, Trash2, Video,
} from 'lucide-react';
import { createProject, deleteProject, fetchProjects, updateProject } from '../lib/projectsApi';
import { createNews, deleteNews, fetchNews, updateNews } from '../lib/newsApi';
import { getRegionLabel, mouqataasData, regionPins } from '../data/projectsData';

// ── Empty forms ───────────────────────────────────────────────────────────────

const emptyProjectForm = {
  id: '',
  title: '',
  regionId: regionPins[0]?.id || '',
  mouqataa: mouqataasData[regionPins[0]?.id]?.[0] || '',
  category: '',
  description: '',
  impact: '',
  projectDate: '',
  existingMedia: [],
};

const emptyNewsForm = {
  id: '',
  title: '',
  category: '',
  excerpt: '',
  body: '',
  publishedAt: '',
  existingMedia: [],
};

// ── Admin copy ────────────────────────────────────────────────────────────────

const adminCopy = {
  ar: {
    adminTag: 'لوحة الإدارة',
    title: 'إدارة المحتوى',
    subtitle: 'أضف أو عدّل أو احذف المشاريع والأخبار. كل عملية حفظ تظهر مباشرة في الموقع.',
    back: 'العودة للموقع',
    langLabel: 'اللغة',
    projectsTab: 'المشاريع',
    newsTab: 'الأخبار',
    // Projects
    editProject: 'تعديل المشروع',
    addProject: 'إضافة مشروع',
    sourceHelp: 'ارفع الصور والفيديوهات من جهازك.',
    newButton: 'جديد',
    titleLabel: 'عنوان المشروع',
    titlePlaceholder: 'حملة تنظيف الشاطئ',
    regionLabel: 'الولاية',
    mouqataaLabel: 'المقاطعة',
    categoryLabel: 'الفئة',
    categoryPlaceholder: 'البيئة البحرية',
    descriptionLabel: 'الوصف',
    descriptionPlaceholder: 'اشرح المشروع والهدف والنشاط الميداني.',
    impactLabel: 'ملخص الأثر',
    impactPlaceholder: 'جمع 12 طن، وشارك 450 شخصًا',
    dateLabel: 'تاريخ المشروع',
    uploadVideoLabel: 'رفع فيديو',
    uploadVideoHelp: 'ارفع ملف فيديو من جهازك.',
    uploadImagesLabel: 'رفع صور',
    uploadImagesHelp: 'يمكنك رفع صورة واحدة أو عدة صور.',
    saving: 'جاري الحفظ...',
    publish: 'نشر المشروع',
    update: 'تحديث المشروع',
    published: 'المشاريع المنشورة',
    publishedCount: 'مشروع على الخريطة',
    emptyList: 'لا توجد مشاريع منشورة بعد.',
    edit: 'تعديل',
    delete: 'حذف',
    mediaNote: 'ملاحظة الوسائط',
    mediaNoteText: 'الملفات تُحفظ في Cloudinary.',
    saved: 'تم حفظ المشروع ونشره.',
    removed: 'تم حذف المشروع.',
    errorDefault: 'حدث خطأ أثناء الحفظ.',
    requiredFields: 'العنوان والفئة والوصف مطلوبة.',
    selectedVideo: 'فيديو مختار',
    selectedImage: 'صور مختارة',
    imageLabel: 'وسائط المشروع',
    // News
    addNews: 'إضافة خبر',
    editNews: 'تعديل الخبر',
    newsTitleLabel: 'عنوان الخبر',
    newsTitlePlaceholder: 'حملة تشجير ناجحة في نواكشوط',
    newsCategoryLabel: 'التصنيف',
    newsCategoryPlaceholder: 'تقرير / فعالية / إعلان',
    newsExcerptLabel: 'ملخص قصير',
    newsExcerptPlaceholder: 'وصف موجز يظهر في بطاقة الخبر (جملة أو جملتان).',
    newsBodyLabel: 'محتوى الخبر',
    newsBodyPlaceholder: 'اكتب هنا التفاصيل الكاملة للخبر أو النشاط.',
    newsDateLabel: 'تاريخ النشر',
    newsUploadImagesLabel: 'صور الخبر',
    newsUploadVideoLabel: 'فيديو الخبر',
    publishNews: 'نشر الخبر',
    updateNews: 'تحديث الخبر',
    publishedNews: 'الأخبار المنشورة',
    publishedNewsCount: 'خبر منشور',
    newsEmptyList: 'لا توجد أخبار منشورة بعد. أضف أول خبر.',
    newsSaved: 'تم نشر الخبر بنجاح.',
    newsRemoved: 'تم حذف الخبر.',
    newsRequiredFields: 'عنوان الخبر مطلوب.',
  },
  fr: {
    adminTag: 'Administration',
    title: 'Gestion du contenu',
    subtitle: 'Ajoutez, modifiez ou supprimez des projets et actualités. Chaque enregistrement est immédiatement visible.',
    back: 'Retour au site',
    langLabel: 'Langue',
    projectsTab: 'Projets',
    newsTab: 'Actualités',
    // Projects
    editProject: 'Modifier le projet',
    addProject: 'Ajouter un projet',
    sourceHelp: 'Importez des photos et vidéos depuis votre appareil.',
    newButton: 'Nouveau',
    titleLabel: 'Titre du projet',
    titlePlaceholder: 'Campagne de nettoyage des plages',
    regionLabel: 'Wilaya',
    mouqataaLabel: 'Moughataa',
    categoryLabel: 'Catégorie',
    categoryPlaceholder: 'Environnement marin',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Expliquez le projet, l\'objectif et l\'activité terrain.',
    impactLabel: 'Résumé d\'impact',
    impactPlaceholder: '12 tonnes collectées, 450 personnes engagées',
    dateLabel: 'Date du projet',
    uploadVideoLabel: 'Importer une vidéo',
    uploadVideoHelp: 'Importez un fichier vidéo depuis votre appareil.',
    uploadImagesLabel: 'Importer des images',
    uploadImagesHelp: 'Vous pouvez importer une ou plusieurs images.',
    saving: 'Enregistrement...',
    publish: 'Publier le projet',
    update: 'Mettre à jour',
    published: 'Projets publiés',
    publishedCount: 'projet sur la carte',
    emptyList: 'Aucun projet publié pour le moment.',
    edit: 'Modifier',
    delete: 'Supprimer',
    mediaNote: 'Note média',
    mediaNoteText: 'Les fichiers sont stockés dans Cloudinary.',
    saved: 'Projet enregistré et publié.',
    removed: 'Projet supprimé.',
    errorDefault: 'Une erreur est survenue lors de l\'enregistrement.',
    requiredFields: 'Le titre, la catégorie et la description sont obligatoires.',
    selectedVideo: 'Vidéo sélectionnée',
    selectedImage: 'Images sélectionnées',
    imageLabel: 'Médias du projet',
    // News
    addNews: 'Ajouter une actualité',
    editNews: 'Modifier l\'actualité',
    newsTitleLabel: 'Titre de l\'actualité',
    newsTitlePlaceholder: 'Campagne de reboisement réussie à Nouakchott',
    newsCategoryLabel: 'Catégorie',
    newsCategoryPlaceholder: 'Rapport / Événement / Annonce',
    newsExcerptLabel: 'Résumé court',
    newsExcerptPlaceholder: 'Brève description affichée sur la carte (1-2 phrases).',
    newsBodyLabel: 'Contenu complet',
    newsBodyPlaceholder: 'Rédigez ici le texte complet de l\'actualité.',
    newsDateLabel: 'Date de publication',
    newsUploadImagesLabel: 'Photos de l\'actualité',
    newsUploadVideoLabel: 'Vidéo de l\'actualité',
    publishNews: 'Publier l\'actualité',
    updateNews: 'Mettre à jour',
    publishedNews: 'Actualités publiées',
    publishedNewsCount: 'actualité publiée',
    newsEmptyList: 'Aucune actualité publiée pour le moment.',
    newsSaved: 'Actualité publiée avec succès.',
    newsRemoved: 'Actualité supprimée.',
    newsRequiredFields: 'Le titre est obligatoire.',
  },
  en: {
    adminTag: 'Admin',
    title: 'Content Management',
    subtitle: 'Add, update, or remove map projects and news articles. Every save updates the public site immediately.',
    back: 'Back to site',
    langLabel: 'Language',
    projectsTab: 'Projects',
    newsTab: 'News',
    // Projects
    editProject: 'Edit project',
    addProject: 'Add project',
    sourceHelp: 'Upload photos and videos from your device.',
    newButton: 'New',
    titleLabel: 'Project title',
    titlePlaceholder: 'Beach cleanup campaign',
    regionLabel: 'Wilaya',
    mouqataaLabel: 'Mouqataa',
    categoryLabel: 'Category',
    categoryPlaceholder: 'Marine environment',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Explain the project, the goal, and the field activity.',
    impactLabel: 'Impact summary',
    impactPlaceholder: '12 tons collected, 450 people engaged',
    dateLabel: 'Project date',
    uploadVideoLabel: 'Upload video',
    uploadVideoHelp: 'Upload a video file from your device.',
    uploadImagesLabel: 'Upload images',
    uploadImagesHelp: 'You can upload one or many images.',
    saving: 'Saving...',
    publish: 'Publish project',
    update: 'Update project',
    published: 'Published projects',
    publishedCount: 'item on the public map',
    emptyList: 'No projects yet. Add your first one.',
    edit: 'Edit',
    delete: 'Delete',
    mediaNote: 'Media note',
    mediaNoteText: 'Files are stored in Cloudinary.',
    saved: 'Project saved and published.',
    removed: 'Project removed.',
    errorDefault: 'Something went wrong while saving.',
    requiredFields: 'Title, category, and description are required.',
    selectedVideo: 'Selected video',
    selectedImage: 'Selected images',
    imageLabel: 'Project media',
    // News
    addNews: 'Add news article',
    editNews: 'Edit article',
    newsTitleLabel: 'Article title',
    newsTitlePlaceholder: 'Successful afforestation campaign in Nouakchott',
    newsCategoryLabel: 'Category',
    newsCategoryPlaceholder: 'Report / Event / Announcement',
    newsExcerptLabel: 'Short excerpt',
    newsExcerptPlaceholder: 'Brief summary shown on the news card (1-2 sentences).',
    newsBodyLabel: 'Full content',
    newsBodyPlaceholder: 'Write the full article body here.',
    newsDateLabel: 'Publication date',
    newsUploadImagesLabel: 'Article images',
    newsUploadVideoLabel: 'Article video',
    publishNews: 'Publish article',
    updateNews: 'Update article',
    publishedNews: 'Published articles',
    publishedNewsCount: 'article published',
    newsEmptyList: 'No news articles yet. Add your first one.',
    newsSaved: 'Article published successfully.',
    newsRemoved: 'Article removed.',
    newsRequiredFields: 'Article title is required.',
  },
};

// ── Shared styles ─────────────────────────────────────────────────────────────

const tabBtnStyle = (active) => ({
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '10px 20px', borderRadius: '12px', border: 'none',
  background: active ? 'white' : 'transparent',
  color: active ? 'var(--emerald-700)' : 'var(--text-secondary)',
  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
  boxShadow: active ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
  transition: 'all 0.2s ease',
});

const deleteBtn = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '8px 12px', borderRadius: '12px',
  border: '1px solid rgba(220,38,38,0.18)',
  background: 'rgba(220,38,38,0.04)', color: '#b91c1c',
  fontWeight: 700, cursor: 'pointer',
};

// ── Main component ────────────────────────────────────────────────────────────

export default function MapAdmin() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('projects');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProjectForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // News state
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [newsImageFiles, setNewsImageFiles] = useState([]);
  const [newsVideoFile, setNewsVideoFile] = useState(null);
  const [newsSaving, setNewsSaving] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsNotice, setNewsNotice] = useState('');
  const [newsError, setNewsError] = useState('');

  const ui = adminCopy[lang] || adminCopy.en;
  const editingProject = useMemo(
    () => projects.find((p) => p.id === form.id) || null,
    [form.id, projects]
  );
  const editingArticle = useMemo(
    () => newsArticles.find((a) => a.id === newsForm.id) || null,
    [newsForm.id, newsArticles]
  );

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.style.colorScheme = 'light';
  }, [lang]);

  // Load projects
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      setProjects(await fetchProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setIsLoading(false);
    }
  };

  // Load news
  const loadNews = async () => {
    setNewsLoading(true);
    try {
      setNewsArticles(await fetchNews());
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchProjects(), fetchNews()])
      .then(([projs, arts]) => {
        if (mounted) {
          setProjects(projs);
          setNewsArticles(arts);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) { setIsLoading(false); setNewsLoading(false); }
      });
    return () => { mounted = false; };
  }, []);

  // ── Project actions ─────────────────────────────────────────────────────────

  const resetProjectForm = () => {
    setForm(emptyProjectForm);
    setImageFiles([]);
    setVideoFile(null);
  };

  const startEditingProject = (project) => {
    setForm({
      id: project.id,
      title: project.title,
      regionId: project.regionId,
      mouqataa: project.mouqataa || mouqataasData[project.regionId]?.[0] || '',
      category: project.category,
      description: project.description,
      impact: project.impact,
      projectDate: project.projectDate || '',
      existingMedia: project.media || [],
    });
    setImageFiles([]);
    setVideoFile(null);
    setNotice('');
    setError('');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setNotice('');
    setError('');
    try {
      if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
        throw new Error(ui.requiredFields);
      }
      const payload = {
        title: form.title.trim(),
        regionId: form.regionId,
        mouqataa: form.mouqataa,
        category: form.category.trim(),
        description: form.description.trim(),
        impact: form.impact.trim(),
        projectDate: form.projectDate || new Date().toISOString().slice(0, 10),
        existingMediaJson: JSON.stringify(form.existingMedia || []),
        imageUrls: [],
        videoUrl: '',
      };
      if (form.id) {
        await updateProject(form.id, payload, imageFiles, videoFile);
      } else {
        await createProject(payload, imageFiles, videoFile);
      }
      await loadProjects();
      resetProjectForm();
      setNotice(ui.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      await loadProjects();
      if (form.id === projectId) resetProjectForm();
      setNotice(ui.removed);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    }
  };

  // ── News actions ────────────────────────────────────────────────────────────

  const resetNewsForm = () => {
    setNewsForm(emptyNewsForm);
    setNewsImageFiles([]);
    setNewsVideoFile(null);
  };

  const startEditingArticle = (article) => {
    setNewsForm({
      id: article.id,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      body: article.body,
      publishedAt: article.publishedAt || '',
      existingMedia: article.media || [],
    });
    setNewsImageFiles([]);
    setNewsVideoFile(null);
    setNewsNotice('');
    setNewsError('');
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setNewsSaving(true);
    setNewsNotice('');
    setNewsError('');
    try {
      if (!newsForm.title.trim()) throw new Error(ui.newsRequiredFields);
      const payload = {
        title: newsForm.title.trim(),
        category: newsForm.category.trim(),
        excerpt: newsForm.excerpt.trim(),
        body: newsForm.body.trim(),
        publishedAt: newsForm.publishedAt || new Date().toISOString().slice(0, 10),
        existingMediaJson: JSON.stringify(newsForm.existingMedia || []),
      };
      if (newsForm.id) {
        await updateNews(newsForm.id, payload, newsImageFiles, newsVideoFile);
      } else {
        await createNews(payload, newsImageFiles, newsVideoFile);
      }
      await loadNews();
      resetNewsForm();
      setNewsNotice(ui.newsSaved);
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setNewsSaving(false);
    }
  };

  const handleNewsDelete = async (articleId) => {
    try {
      await deleteNews(articleId);
      await loadNews();
      if (newsForm.id === articleId) resetNewsForm();
      setNewsNotice(ui.newsRemoved);
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : ui.errorDefault);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const selectedVideoLabel = videoFile ? `${ui.selectedVideo}: ${videoFile.name}` : '';
  const selectedImagesLabel = imageFiles.length > 0 ? `${ui.selectedImage}: ${imageFiles.length}` : '';
  const newsSelectedVideoLabel = newsVideoFile ? `${ui.selectedVideo}: ${newsVideoFile.name}` : '';
  const newsSelectedImagesLabel = newsImageFiles.length > 0 ? `${ui.selectedImage}: ${newsImageFiles.length}` : '';

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, rgba(16,185,129,0.18), transparent 35%), linear-gradient(180deg, #f8fafb 0%, #eef8f5 100%)',
      padding: '32px 0 48px',
    }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald-700)', letterSpacing: '0.12em' }}>
              {ui.adminTag}
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px' }}>{ui.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '720px' }}>{ui.subtitle}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="var(--emerald-700)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{ui.langLabel}</span>
              {['ar', 'fr', 'en'].map((code) => (
                <button
                  key={code} type="button" onClick={() => setLang(code)}
                  style={{
                    border: '1px solid rgba(16,185,129,0.18)',
                    background: lang === code ? 'var(--emerald-500)' : 'white',
                    color: lang === code ? 'white' : 'var(--text-primary)',
                    padding: '8px 12px', borderRadius: '999px', cursor: 'pointer', fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {code}
                </button>
              ))}
            </div>

            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px', borderRadius: '14px',
              border: '1px solid rgba(16,185,129,0.18)', background: 'white',
              color: 'var(--text-primary)', fontWeight: 700, boxShadow: 'var(--shadow-soft)',
            }}>
              <ArrowLeft size={16} />
              {ui.back}
            </a>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'inline-flex', gap: '4px', padding: '5px',
          background: 'rgba(16,185,129,0.07)', borderRadius: '16px',
          marginBottom: '24px',
        }}>
          <button type="button" onClick={() => setActiveTab('projects')} style={tabBtnStyle(activeTab === 'projects')}>
            <Eye size={15} />
            {ui.projectsTab}
          </button>
          <button type="button" onClick={() => setActiveTab('news')} style={tabBtnStyle(activeTab === 'news')}>
            <Newspaper size={15} />
            {ui.newsTab}
          </button>
        </div>

        {/* ── PROJECTS TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 0.85fr)',
            gap: '24px', alignItems: 'start',
          }}>
            {/* Form panel */}
            <section className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {editingProject ? ui.editProject : ui.addProject}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ui.sourceHelp}</p>
                </div>
                {editingProject && (
                  <button type="button" onClick={resetProjectForm} className="btn-secondary" style={{ padding: '10px 14px', fontSize: '0.9rem' }}>
                    <Plus size={16} />{ui.newButton}
                  </button>
                )}
              </div>

              <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{ui.titleLabel}</label>
                  <input className="form-control" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={ui.titlePlaceholder} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{ui.regionLabel}</label>
                    <select className="form-control" value={form.regionId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setForm({ ...form, regionId: newId, mouqataa: mouqataasData[newId]?.[0] || '' });
                      }}>
                      {regionPins.map((r) => (
                        <option key={r.id} value={r.id}>{getRegionLabel(r.id, lang)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{ui.mouqataaLabel}</label>
                    <select className="form-control" value={form.mouqataa}
                      onChange={(e) => setForm({ ...form, mouqataa: e.target.value })}>
                      {(mouqataasData[form.regionId] || []).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.categoryLabel}</label>
                  <input className="form-control" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder={ui.categoryPlaceholder} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.descriptionLabel}</label>
                  <textarea className="form-control" rows="4" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={ui.descriptionPlaceholder} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.impactLabel}</label>
                  <input className="form-control" value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: e.target.value })}
                    placeholder={ui.impactPlaceholder} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.dateLabel}</label>
                  <input type="date" className="form-control" value={form.projectDate}
                    onChange={(e) => setForm({ ...form, projectDate: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.uploadVideoLabel}</label>
                  <input type="file" accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="form-control" style={{ paddingTop: '9px', paddingBottom: '9px' }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>{ui.uploadVideoHelp}</p>
                  {selectedVideoLabel && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>{selectedVideoLabel}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.uploadImagesLabel}</label>
                  <input type="file" accept="image/*" multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    className="form-control" style={{ paddingTop: '9px', paddingBottom: '9px' }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>{ui.uploadImagesHelp}</p>
                  {selectedImagesLabel && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>{selectedImagesLabel}</p>
                  )}
                </div>

                {editingProject?.media?.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">{ui.imageLabel}</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {editingProject.media.map((item) => (
                        <span key={item.id} style={{
                          padding: '6px 10px', borderRadius: '999px',
                          background: 'rgba(16,185,129,0.08)', color: 'var(--emerald-700)',
                          fontSize: '0.78rem', fontWeight: 700,
                        }}>
                          {item.kind === 'video' ? 'Video' : 'Image'} {item.sourceType === 'upload' ? 'upload' : 'url'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', color: '#b91c1c', fontWeight: 600 }}>
                    {error}
                  </div>
                )}
                {notice && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', color: 'var(--emerald-700)', fontWeight: 600 }}>
                    {notice}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={isSaving} style={{ gap: '8px' }}>
                  <Save size={16} />
                  {isSaving ? ui.saving : editingProject ? ui.update : ui.publish}
                </button>
              </form>
            </section>

            {/* Projects list panel */}
            <aside className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{ui.published}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {projects.length} {ui.publishedCount}
                  </p>
                </div>
                <Eye size={18} color="var(--emerald-600)" />
              </div>

              {isLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>{ui.saving}</div>
              ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {projects.length === 0 ? (
                    <div style={{ padding: '20px', borderRadius: '18px', border: '1px dashed rgba(16,185,129,0.24)', color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.04)' }}>
                      {ui.emptyList}
                    </div>
                  ) : (
                    projects.map((project) => (
                      <article key={project.id} style={{ padding: '16px', borderRadius: '18px', border: '1px solid rgba(16,185,129,0.12)', background: 'white', display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface-alt)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {project.images[0] ? (
                              <img src={project.images[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <FileImage size={20} color="var(--text-muted)" />
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
                                {getRegionLabel(project.regionId, lang)}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {project.images.length} photo{project.images.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.25 }}>{project.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{project.category}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <button type="button" className="btn-secondary" onClick={() => startEditingProject(project)} style={{ padding: '8px 12px' }}>
                            <PencilLine size={15} />{ui.edit}
                          </button>
                          <button type="button" onClick={() => handleProjectDelete(project.id)} style={deleteBtn}>
                            <Trash2 size={15} />{ui.delete}
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              <div style={{ marginTop: '20px', padding: '16px', borderRadius: '18px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 800 }}>
                  <Video size={16} />{ui.mediaNote}
                </div>
                {ui.mediaNoteText}
              </div>
            </aside>
          </div>
        )}

        {/* ── NEWS TAB ───────────────────────────────────────────────────────── */}
        {activeTab === 'news' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 0.85fr)',
            gap: '24px', alignItems: 'start',
          }}>
            {/* News form panel */}
            <section className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {editingArticle ? ui.editNews : ui.addNews}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ui.sourceHelp}</p>
                </div>
                {editingArticle && (
                  <button type="button" onClick={resetNewsForm} className="btn-secondary" style={{ padding: '10px 14px', fontSize: '0.9rem' }}>
                    <Plus size={16} />{ui.newButton}
                  </button>
                )}
              </div>

              <form onSubmit={handleNewsSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{ui.newsTitleLabel}</label>
                  <input className="form-control" value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    placeholder={ui.newsTitlePlaceholder} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{ui.newsCategoryLabel}</label>
                    <input className="form-control" value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                      placeholder={ui.newsCategoryPlaceholder} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={13} style={{ display: 'inline', marginInlineEnd: '5px' }} />
                      {ui.newsDateLabel}
                    </label>
                    <input type="date" className="form-control" value={newsForm.publishedAt}
                      onChange={(e) => setNewsForm({ ...newsForm, publishedAt: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.newsExcerptLabel}</label>
                  <textarea className="form-control" rows="2" value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    placeholder={ui.newsExcerptPlaceholder} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.newsBodyLabel}</label>
                  <textarea className="form-control" rows="6" value={newsForm.body}
                    onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                    placeholder={ui.newsBodyPlaceholder} />
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.newsUploadImagesLabel}</label>
                  <input type="file" accept="image/*" multiple
                    onChange={(e) => setNewsImageFiles(Array.from(e.target.files || []))}
                    className="form-control" style={{ paddingTop: '9px', paddingBottom: '9px' }} />
                  {newsSelectedImagesLabel && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>{newsSelectedImagesLabel}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.newsUploadVideoLabel}</label>
                  <input type="file" accept="video/*"
                    onChange={(e) => setNewsVideoFile(e.target.files?.[0] || null)}
                    className="form-control" style={{ paddingTop: '9px', paddingBottom: '9px' }} />
                  {newsSelectedVideoLabel && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>{newsSelectedVideoLabel}</p>
                  )}
                </div>

                {newsError && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', color: '#b91c1c', fontWeight: 600 }}>
                    {newsError}
                  </div>
                )}
                {newsNotice && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', color: 'var(--emerald-700)', fontWeight: 600 }}>
                    {newsNotice}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={newsSaving} style={{ gap: '8px' }}>
                  <Save size={16} />
                  {newsSaving ? ui.saving : editingArticle ? ui.updateNews : ui.publishNews}
                </button>
              </form>
            </section>

            {/* News list panel */}
            <aside className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{ui.publishedNews}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {newsArticles.length} {ui.publishedNewsCount}
                  </p>
                </div>
                <Newspaper size={18} color="var(--emerald-600)" />
              </div>

              {newsLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>{ui.saving}</div>
              ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {newsArticles.length === 0 ? (
                    <div style={{ padding: '20px', borderRadius: '18px', border: '1px dashed rgba(16,185,129,0.24)', color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.04)' }}>
                      {ui.newsEmptyList}
                    </div>
                  ) : (
                    newsArticles.map((article) => (
                      <article key={article.id} style={{ padding: '16px', borderRadius: '18px', border: '1px solid rgba(16,185,129,0.12)', background: 'white', display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface-alt)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {article.images[0] ? (
                              <img src={article.images[0]} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Newspaper size={20} color="var(--text-muted)" />
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            {article.category && (
                              <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '999px', background: 'rgba(16,185,129,0.08)', color: 'var(--emerald-700)', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px' }}>
                                {article.category}
                              </span>
                            )}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.3, margin: '0 0 4px' }}>{article.title}</h3>
                            {article.publishedAt && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                                <Calendar size={11} />
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </p>
                            )}
                            {article.excerpt && (
                              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <button type="button" className="btn-secondary" onClick={() => startEditingArticle(article)} style={{ padding: '8px 12px' }}>
                            <PencilLine size={15} />{ui.edit}
                          </button>
                          <button type="button" onClick={() => handleNewsDelete(article.id)} style={deleteBtn}>
                            <Trash2 size={15} />{ui.delete}
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}
            </aside>
          </div>
        )}

      </div>
    </main>
  );
}
