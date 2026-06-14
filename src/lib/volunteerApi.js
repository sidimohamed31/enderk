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
  const isJson = options.body && !(options.body instanceof FormData);
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: isJson
      ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
      : options.headers,
  });

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.detail || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function normalizeVolunteer(v) {
  return {
    id: v.id,
    name: v.name,
    email: v.email,
    phone: v.phone,
    region: v.region,
    interest: v.interest,
    experience: v.experience,
    status: v.status,
    submittedAt: v.submitted_at,
  };
}

export async function submitVolunteer(payload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  formData.append('phone', payload.phone);
  formData.append('region', payload.region);
  formData.append('interest', payload.interest);
  if (payload.experience) formData.append('experience', payload.experience);
  const data = await request('/volunteers', { method: 'POST', body: formData });
  return normalizeVolunteer(data);
}

export async function fetchVolunteers() {
  const data = await request('/volunteers');
  return (data?.volunteers || []).map(normalizeVolunteer);
}

export async function markVolunteerContacted(id) {
  const data = await request(`/volunteers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'contacted' }),
  });
  return normalizeVolunteer(data);
}

export async function deleteVolunteer(id) {
  await request(`/volunteers/${id}`, { method: 'DELETE' });
}
