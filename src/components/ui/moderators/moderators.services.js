const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = window.localStorage.getItem("hemalink-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getModerators = async () => {
  const res = await fetch(`${API}/api/admin/users?role=1`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch moderators (${res.status})`);
  const json = await res.json();
  return json.data;
};

export const getAdmins = async () => {
  const res = await fetch(`${API}/api/admin/users?role=2`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch admins (${res.status})`);
  const json = await res.json();
  return json.data;
};

export const createModerator = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const res = await fetch(`${API}/api/admin/moderator`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, email: normalizedEmail, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || `Failed to create moderator (${res.status})`);
    err.errors = json.errors || [];
    throw err;
  }
  return json;
};

export const deleteModerator = async (id) => {
  const res = await fetch(`${API}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete moderator (${res.status})`);
  return res;
};

export const promoteModerator = async (email) => {
  const res = await fetch(`${API}/api/admin/moderator/promote`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Failed to promote moderator (${res.status})`);
  return res.json();
};
