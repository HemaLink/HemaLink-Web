const API = import.meta.env.VITE_API_URL;

const BLOOD_TYPE_LABELS = {
  A_Pos: "A+", A_Neg: "A-",
  B_Pos: "B+", B_Neg: "B-",
  AB_Pos: "AB+", AB_Neg: "AB-",
  O_Pos: "O+", O_Neg: "O-",
};

// C# enum integer values (BloodType): A_Pos=0 … O_Neg=7
const BLOOD_TYPE_INT = {
  A_Pos: 0, A_Neg: 1,
  B_Pos: 2, B_Neg: 3,
  AB_Pos: 4, AB_Neg: 5,
  O_Pos: 6, O_Neg: 7,
};

const BLOOD_TYPE_API_KEYS = Object.fromEntries(
  Object.entries(BLOOD_TYPE_LABELS).map(([k, v]) => [v, k])
);

export const ALL_BLOOD_TYPES = Object.keys(BLOOD_TYPE_LABELS);

export const formatBloodType = (apiType) => BLOOD_TYPE_LABELS[apiType] || apiType;

export const toApiBloodType = (label) => BLOOD_TYPE_API_KEYS[label] || label;

const toIntBloodTypes = (types) => types.map((t) => BLOOD_TYPE_INT[t] ?? t);

function authHeaders() {
  const token = window.localStorage.getItem("hemalink-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getBloodRequests = async () => {
  const res = await fetch(`${API}/api/Donor/blood-requests`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch campaigns");
  return json.data;
};

export const signUpToDonate = async ({ bloodRequestId, donorName, donorEmail, donorPhone }) => {
  const res = await fetch(`${API}/api/Donor/blood-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bloodRequestId, donorName, donorEmail, donorPhone }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json().catch(() => ({}));
};

export const createBloodRequest = async ({ requesterId, requestDate, address, bloodTypesNeeded, targetUnits }) => {
  const res = await fetch(`${API}/api/Moderator/blood-requests?requesterId=${requesterId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ requestDate, address, bloodTypesNeeded: toIntBloodTypes(bloodTypesNeeded), targetUnits }),
  });
  if (!res.ok) throw new Error(`Create failed (${res.status})`);
  return res.json().catch(() => ({}));
};

export const updateBloodRequest = async (requestId, { requestDate, address, bloodTypesNeeded, targetUnits }) => {
  const res = await fetch(`${API}/api/Moderator/blood-requests/${requestId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ requestDate, address, bloodTypesNeeded: toIntBloodTypes(bloodTypesNeeded), targetUnits }),
  });
  if (!res.ok) throw new Error(`Update failed (${res.status})`);
  return res.json().catch(() => ({}));
};

export const deleteBloodRequest = async (requestId) => {
  const res = await fetch(`${API}/api/Moderator/blood-requests/${requestId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  return res.json().catch(() => ({}));
};
