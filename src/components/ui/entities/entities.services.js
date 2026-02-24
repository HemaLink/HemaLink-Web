const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = window.localStorage.getItem("hemalink-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const ADMISSION_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

export const formatAdmissionStatus = (status) => ADMISSION_STATUS[status] ?? `Unknown (${status})`;

export const getRequesters = async () => {
  const res = await fetch(`${API}/api/Moderator/requesters`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch entities (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
};
