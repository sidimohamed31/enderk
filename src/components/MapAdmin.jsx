import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Eye, FileImage, Globe, PencilLine, Plus, Save, Trash2, Video } from 'lucide-react';
import { createProject, deleteProject, fetchProjects, updateProject } from '../lib/projectsApi';
import { getRegionLabel, mouqataasData, regionPins } from '../data/projectsData';

const emptyForm = {
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

const adminCopy = {
  ar: {
    adminTag: 'لوحة الإدارة',
    title: 'إدارة مشاريع الخريطة',
    subtitle: 'أضف أو عدّل أو احذف المشاريع من هنا. كل عملية حفظ تظهر مباشرة في الخريطة العامة.',
    back: 'العودة للموقع',
    langLabel: 'اللغة',
    editProject: 'تعديل المشروع',
    addProject: 'إضافة مشروع',
    sourceHelp: 'ارفع الصور والفيديوهات من جهازك. الملفات تُحفظ في Cloudinary وتظهر فورًا في الموقع.',
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
    videoLabel: 'فيديو المشروع',
    uploadVideoLabel: 'رفع فيديو',
    uploadVideoHelp: 'ارفع ملف فيديو من جهازك.',
    imageLabel: 'صور المشروع',
    uploadImagesLabel: 'رفع صور',
    uploadImagesHelp: 'يمكنك رفع صورة واحدة أو عدة صور.',
    saving: 'جاري الحفظ...',
    publish: 'نشر المشروع',
    update: 'تحديث المشروع',
    published: 'المشاريع المنشورة',
    publishedCount: 'عنصر على الخريطة العامة',
    emptyList: 'لا توجد مشاريع منشورة بعد. أضف أول مشروع من اليسار وسيظهر هنا.',
    edit: 'تعديل',
    delete: 'حذف',
    mediaNote: 'ملاحظة الوسائط',
    mediaNoteText: 'الملفات تُحفظ في Cloudinary. قاعدة البيانات تخزن بيانات المشروع وروابط الوسائط لاستخدامها في الموقع.',
    saved: 'تم حفظ المشروع ونشره على الخريطة العامة.',
    removed: 'تم حذف المشروع.',
    errorDefault: 'حدث خطأ أثناء حفظ المشروع.',
    requiredFields: 'العنوان والفئة والوصف مطلوبة.',
    selectedVideo: 'فيديو مختار',
    selectedImage: 'صور مختارة',
  },
  fr: {
    adminTag: 'Administration',
    title: 'Gestion des projets de la carte',
    subtitle: 'Ajoutez, modifiez ou supprimez des projets ici. Chaque enregistrement apparaît immédiatement sur la carte publique.',
    back: 'Retour au site',
    langLabel: 'Langue',
    editProject: 'Modifier le projet',
    addProject: 'Ajouter un projet',
    sourceHelp: 'Importez les photos et vidéos depuis votre appareil. Les fichiers sont stockés dans Cloudinary.',
    newButton: 'Nouveau',
    titleLabel: 'Titre du projet',
    titlePlaceholder: 'Campagne de nettoyage des plages',
    regionLabel: 'Wilaya',
    mouqataaLabel: 'Moughataa',
    categoryLabel: 'Catégorie',
    categoryPlaceholder: 'Environnement marin',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Expliquez le projet, l’objectif et l’activité terrain.',
    impactLabel: 'Résumé d’impact',
    impactPlaceholder: '12 tonnes collectées, 450 personnes engagées',
    dateLabel: 'Date du projet',
    videoLabel: 'Vidéo du projet',
    uploadVideoLabel: 'Importer une vidéo',
    uploadVideoHelp: 'Importez un fichier vidéo depuis votre appareil.',
    imageLabel: 'Photos du projet',
    uploadImagesLabel: 'Importer des images',
    uploadImagesHelp: 'Vous pouvez importer une ou plusieurs images.',
    saving: 'Enregistrement...',
    publish: 'Publier le projet',
    update: 'Mettre à jour',
    published: 'Projets publiés',
    publishedCount: 'élément sur la carte publique',
    emptyList: 'Aucun projet publié pour le moment. Ajoutez-en un à gauche et il apparaîtra ici.',
    edit: 'Modifier',
    delete: 'Supprimer',
    mediaNote: 'Note média',
    mediaNoteText: 'Les fichiers sont stockés dans Cloudinary. La base de données conserve les informations du projet et les liens des médias.',
    saved: 'Projet enregistré et publié sur la carte publique.',
    removed: 'Projet supprimé.',
    errorDefault: 'Une erreur est survenue lors de l’enregistrement du projet.',
    requiredFields: 'Le titre, la catégorie et la description sont obligatoires.',
    selectedVideo: 'Vidéo sélectionnée',
    selectedImage: 'Images sélectionnées',
  },
  en: {
    adminTag: 'Admin',
    title: 'Project Map Admin',
    subtitle: 'Add, update, or remove map entries here. Every save updates the public map immediately.',
    back: 'Back to site',
    langLabel: 'Language',
    editProject: 'Edit project',
    addProject: 'Add project',
    sourceHelp: 'Upload photos and videos from your device. Files are stored in Cloudinary.',
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
    videoLabel: 'Project video',
    uploadVideoLabel: 'Upload video',
    uploadVideoHelp: 'Upload a video file from your device.',
    imageLabel: 'Project images',
    uploadImagesLabel: 'Upload images',
    uploadImagesHelp: 'You can upload one or many images.',
    saving: 'Saving...',
    publish: 'Publish project',
    update: 'Update project',
    published: 'Published projects',
    publishedCount: 'item on the public map',
    emptyList: 'No projects yet. Add your first one on the left and it will appear here.',
    edit: 'Edit',
    delete: 'Delete',
    mediaNote: 'Media note',
    mediaNoteText: 'Files are stored in Cloudinary. The database keeps the project details and media links.',
    saved: 'Project saved and published to the public map.',
    removed: 'Project removed.',
    errorDefault: 'Something went wrong while saving the project.',
    requiredFields: 'Title, category, and description are required.',
    selectedVideo: 'Selected video',
    selectedImage: 'Selected images',
  },
};

export default function MapAdmin() {
  const [lang, setLang] = useState('en');
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const ui = adminCopy[lang] || adminCopy.en;
  const editingProject = useMemo(() => projects.find((project) => project.id === form.id) || null, [form.id, projects]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.style.colorScheme = 'light';
  }, [lang]);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjectsFromApi = async () => {
      try {
        const data = await fetchProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : ui.errorDefault;
          if (!message.includes('404') && !message.toLowerCase().includes('not found')) {
            setError(message);
          } else {
            setProjects([]);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjectsFromApi();

    return () => {
      isMounted = false;
    };
  }, [ui.errorDefault]);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFiles([]);
    setVideoFile(null);
  };

  const startEditing = (project) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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

      await load();
      resetForm();
      setNotice(ui.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      await load();
      if (form.id === projectId) resetForm();
      setNotice(ui.removed);
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.errorDefault);
    }
  };

  const selectedVideoLabel = videoFile ? `${ui.selectedVideo}: ${videoFile.name}` : '';
  const selectedImagesLabel = imageFiles.length > 0 ? `${ui.selectedImage}: ${imageFiles.length}` : '';

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 35%), linear-gradient(180deg, #f8fafb 0%, #eef8f5 100%)',
        padding: '32px 0 48px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
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
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  style={{
                    border: '1px solid rgba(16, 185, 129, 0.18)',
                    background: lang === code ? 'var(--emerald-500)' : 'white',
                    color: lang === code ? 'white' : 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {code}
                </button>
              ))}
            </div>

            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(16, 185, 129, 0.18)',
                background: 'white',
                color: 'var(--text-primary)',
                fontWeight: 700,
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <ArrowLeft size={16} />
              {ui.back}
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 0.85fr)',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          <section className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {editingProject ? ui.editProject : ui.addProject}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ui.sourceHelp}</p>
              </div>

              {editingProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} />
                  {ui.newButton}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{ui.titleLabel}</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder={ui.titlePlaceholder}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{ui.regionLabel}</label>
                  <select
                    className="form-control"
                    value={form.regionId}
                    onChange={(event) => {
                      const newRegionId = event.target.value;
                      const firstMouqataa = mouqataasData[newRegionId]?.[0] || '';
                      setForm({ ...form, regionId: newRegionId, mouqataa: firstMouqataa });
                    }}
                  >
                    {regionPins.map((region) => (
                      <option key={region.id} value={region.id}>
                        {getRegionLabel(region.id, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{ui.mouqataaLabel}</label>
                  <select
                    className="form-control"
                    value={form.mouqataa}
                    onChange={(event) => setForm({ ...form, mouqataa: event.target.value })}
                  >
                    {(mouqataasData[form.regionId] || []).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{ui.categoryLabel}</label>
                <input
                  className="form-control"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder={ui.categoryPlaceholder}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{ui.descriptionLabel}</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder={ui.descriptionPlaceholder}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{ui.impactLabel}</label>
                <input
                  className="form-control"
                  value={form.impact}
                  onChange={(event) => setForm({ ...form, impact: event.target.value })}
                  placeholder={ui.impactPlaceholder}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{ui.dateLabel}</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.projectDate}
                  onChange={(event) => setForm({ ...form, projectDate: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{ui.uploadVideoLabel}</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
                  className="form-control"
                  style={{ paddingTop: '9px', paddingBottom: '9px' }}
                />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {ui.uploadVideoHelp}
                </p>
                {selectedVideoLabel && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>
                    {selectedVideoLabel}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{ui.uploadImagesLabel}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                  className="form-control"
                  style={{ paddingTop: '9px', paddingBottom: '9px' }}
                />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {ui.uploadImagesHelp}
                </p>
                {selectedImagesLabel && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', marginTop: '6px', fontWeight: 700 }}>
                    {selectedImagesLabel}
                  </p>
                )}
              </div>

              {editingProject?.media?.length > 0 && (
                <div className="form-group">
                  <label className="form-label">{ui.imageLabel}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {editingProject.media.map((item) => (
                      <span
                        key={item.id}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '999px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: 'var(--emerald-700)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.kind === 'video' ? 'Video' : 'Image'}
                        {' '}
                        {item.sourceType === 'upload' ? 'upload' : 'url'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(220, 38, 38, 0.08)',
                    color: '#b91c1c',
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {notice && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    color: 'var(--emerald-700)',
                    fontWeight: 600,
                  }}
                >
                  {notice}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isSaving} style={{ gap: '8px' }}>
                <Save size={16} />
                {isSaving ? ui.saving : editingProject ? ui.update : ui.publish}
              </button>
            </form>
          </section>

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
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '18px',
                      border: '1px dashed rgba(16, 185, 129, 0.24)',
                      color: 'var(--text-secondary)',
                      background: 'rgba(16, 185, 129, 0.04)',
                    }}
                  >
                    {ui.emptyList}
                  </div>
                ) : (
                  projects.map((project) => (
                    <article
                      key={project.id}
                      style={{
                        padding: '16px',
                        borderRadius: '18px',
                        border: '1px solid rgba(16, 185, 129, 0.12)',
                        background: 'white',
                        display: 'grid',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            background: 'var(--bg-surface-alt)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {project.images[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
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
                              {project.images.length} photo{project.images.length === 1 ? '' : 's'}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.25 }}>{project.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {project.category}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '8px', lineHeight: 1.5 }}>
                            {project.description.length > 130 ? `${project.description.slice(0, 130)}...` : project.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <button type="button" className="btn-secondary" onClick={() => startEditing(project)} style={{ padding: '8px 12px' }}>
                          <PencilLine size={15} />
                          {ui.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(220, 38, 38, 0.18)',
                            background: 'rgba(220, 38, 38, 0.04)',
                            color: '#b91c1c',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={15} />
                          {ui.delete}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '18px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                }}
              >
                <Video size={16} />
                {ui.mediaNote}
              </div>
              {ui.mediaNoteText}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
