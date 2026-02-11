
const API = '/api';

export async function fetchMe() {
  const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchItems() {
  const res = await fetch(`${API}/items`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}/extract/image`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Upload failed');
  }
  return res.json();
}

export async function addItemToCalendar(id) {
  const res = await fetch(`${API}/items/${id}/add-to-calendar`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Failed to add to calendar');
  }
  return res.json();
}

export async function deleteItem(itemId) {
  const res = await fetch(`${API}/items/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
}

export async function updateItem(itemId, updates) {
  const res = await fetch(`${API}/items/${itemId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}
