import { burstCache, peekCache, writeCache } from './apiCache';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://enderk.onrender.com').replace(/\/+$/, '');

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers:
      options.body instanceof FormData
        ? options.headers
        : { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.detail || data?.message || `Request failed with status ${response.status}`;
    throw new Error(`${message} (${response.url})`);
  }

  return data;
}

function normalizeNewsMedia(media = []) {
  return media.map((item) => ({
    id: item.id,
    kind: item.kind,
    sourceType: item.source_type,
    url: item.url,
    storagePath: item.storage_path,
    originalFilename: item.original_filename,
    mimeType: item.mime_type,
    sizeBytes: item.size_bytes,
    sortOrder: item.sort_order,
    createdAt: item.created_at,
  }));
}

export function normalizeArticle(article) {
  const media = normalizeNewsMedia(article.media || []);
  const images = media.filter((m) => m.kind === 'image').map((m) => m.url);
  const video = media.find((m) => m.kind === 'video');
  return {
    id: article.id,
    title: article.title,
    titleFr: article.title_fr || null,
    titleEn: article.title_en || null,
    excerpt: article.excerpt,
    excerptFr: article.excerpt_fr || null,
    excerptEn: article.excerpt_en || null,
    body: article.body,
    bodyFr: article.body_fr || null,
    bodyEn: article.body_en || null,
    category: article.category,
    categoryFr: article.category_fr || null,
    categoryEn: article.category_en || null,
    publishedAt: article.published_at,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
    media,
    images,
    videoUrl: video?.url || null,
  };
}

// Read the cache without triggering any network request.
// Components call this first to render stale data instantly.
export function peekNewsCache() {
  return peekCache('news');
}

export async function fetchNews() {
  const data = await request('/news');
  const articles = (data?.news || []).map(normalizeArticle);
  writeCache('news', articles);
  return articles;
}

export async function fetchNewsArticle(articleId) {
  const data = await request(`/news/${articleId}`);
  return normalizeArticle(data);
}

function buildNewsFormData(payload, imageFiles = [], videoFile = null) {
  const formData = new FormData();
  formData.append('title', payload.title);
  if (payload.excerpt) formData.append('excerpt', payload.excerpt);
  if (payload.body) formData.append('body', payload.body);
  if (payload.category) formData.append('category', payload.category);
  if (payload.publishedAt) formData.append('published_at', payload.publishedAt);
  if (payload.existingMediaJson) formData.append('existing_media_json', payload.existingMediaJson);
  imageFiles.forEach((f) => formData.append('image_files', f));
  if (videoFile) formData.append('video_file', videoFile);
  return formData;
}

export async function createNews(payload, imageFiles = [], videoFile = null) {
  const data = await request('/news', {
    method: 'POST',
    body: buildNewsFormData(payload, imageFiles, videoFile),
  });
  burstCache('news'); // force public pages to re-fetch
  return normalizeArticle(data);
}

export async function updateNews(articleId, payload, imageFiles = [], videoFile = null) {
  const data = await request(`/news/${articleId}`, {
    method: 'PUT',
    body: buildNewsFormData(payload, imageFiles, videoFile),
  });
  burstCache('news');
  return normalizeArticle(data);
}

export async function deleteNews(articleId) {
  await request(`/news/${articleId}`, { method: 'DELETE' });
  burstCache('news');
}
