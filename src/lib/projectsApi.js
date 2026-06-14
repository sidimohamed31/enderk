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
    headers: options.body instanceof FormData ? options.headers : { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.detail || data?.message || `Request failed with status ${response.status}`;
    throw new Error(`${message} (${response.url})`);
  }

  return data;
}

function normalizeMedia(media = []) {
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

export function normalizeProject(project) {
  const media = normalizeMedia(project.media || []);
  const images = media.filter((item) => item.kind === 'image').map((item) => item.url);
  const video = media.find((item) => item.kind === 'video');

  return {
    id: project.id,
    title: project.title,
    regionId: project.region_id,
    mouqataa: project.mouqataa || '',
    category: project.category,
    description: project.description,
    impact: project.impact,
    projectDate: project.project_date,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    media,
    images,
    videoUrl: video?.url || null,
  };
}

// Read the cache without triggering any network request.
// Components call this first to render stale data instantly.
export function peekProjectsCache() {
  return peekCache('projects');
}

export async function fetchProjects() {
  const data = await request('/projects');
  const projects = (data?.projects || []).map(normalizeProject);
  writeCache('projects', projects);
  return projects;
}

function appendField(formData, key, value) {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value);
  }
}

function appendFiles(formData, key, files) {
  files.forEach((file) => formData.append(key, file));
}

function buildProjectFormData(payload, imageFiles = [], videoFile = null) {
  const formData = new FormData();
  appendField(formData, 'title', payload.title);
  appendField(formData, 'region_id', payload.regionId);
  appendField(formData, 'mouqataa', payload.mouqataa);
  appendField(formData, 'category', payload.category);
  appendField(formData, 'description', payload.description);
  appendField(formData, 'impact', payload.impact);
  appendField(formData, 'project_date', payload.projectDate);
  appendField(formData, 'existing_media_json', payload.existingMediaJson);
  appendField(formData, 'video_url', payload.videoUrl);
  appendField(formData, 'image_urls_json', JSON.stringify(payload.imageUrls || []));

  if (imageFiles.length > 0) {
    appendFiles(formData, 'image_files', imageFiles);
  }

  if (videoFile) {
    formData.append('video_file', videoFile);
  }

  return formData;
}

export async function createProject(payload, imageFiles = [], videoFile = null) {
  const data = await request('/projects', {
    method: 'POST',
    body: buildProjectFormData(payload, imageFiles, videoFile),
  });
  burstCache('projects'); // force public pages to re-fetch
  return normalizeProject(data);
}

export async function updateProject(projectId, payload, imageFiles = [], videoFile = null) {
  const data = await request(`/projects/${projectId}`, {
    method: 'PUT',
    body: buildProjectFormData(payload, imageFiles, videoFile),
  });
  burstCache('projects');
  return normalizeProject(data);
}

export async function deleteProject(projectId) {
  await request(`/projects/${projectId}`, {
    method: 'DELETE',
  });
  burstCache('projects');
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
