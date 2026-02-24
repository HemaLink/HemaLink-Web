import React, { useState, useEffect, useMemo, useContext, forwardRef, useImperativeHandle } from "react";
import '../donors/donors.css';
import DeleteConfirm from '../donors/DeleteConfirm';
import CampaignForm from './CampaignForm';
import { getBloodRequests, formatBloodType, updateBloodRequest, deleteBloodRequest, createBloodRequest } from "./campaigns.services";
import AuthContext from "../../../services/authContext/AuthContext";
import { ROLES } from "../../../services/authContext/auth.utils";

const CampaignsTable = forwardRef((props, ref) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [sortKey, setSortKey] = useState('requestDate');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBloodRequests()
      .then((data) => { if (!cancelled) { setCampaigns(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return ' \u2195';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  useImperativeHandle(ref, () => ({ handleAdd }));

  const handleEdit = (campaign) => {
    setEditing(campaign);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const campaign = campaigns.find((x) => x.requestId === id);
    setDeleteTarget(campaign);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBloodRequest(deleteTarget.requestId);
      setCampaigns((c) => c.filter((x) => x.requestId !== deleteTarget.requestId));
    } catch (err) {
      setError(err.message);
    }
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editing) {
        await updateBloodRequest(editing.requestId, formData);
        setCampaigns((c) =>
          c.map((x) => (x.requestId === editing.requestId ? { ...x, ...formData } : x))
        );
      } else {
        const res = await createBloodRequest(formData);
        const created = res.data ?? res;
        setCampaigns((c) => [...c, created]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const sorted = useMemo(() => {
    const copy = [...campaigns];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'requestDate') {
        cmp = new Date(a.requestDate) - new Date(b.requestDate);
      } else {
        const valA = (a[sortKey] || '').toString().toLowerCase();
        const valB = (b[sortKey] || '').toString().toLowerCase();
        cmp = valA.localeCompare(valB);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [campaigns, sortKey, sortDir]);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="donors-container">
      <table className="donors-table">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('requesterName')}>
              Entity{sortIndicator('requesterName')}
            </th>
            <th>Blood Types</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('requestDate')}>
              Date{sortIndicator('requestDate')}
            </th>
            <th>Location</th>
            <th>Registered Donors</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.requestId}>
              <td data-label="Entity">{c.requesterName}</td>
              <td data-label="Blood Types">{c.bloodTypesNeeded.map(formatBloodType).join(', ')}</td>
              <td data-label="Date">{new Date(c.requestDate).toLocaleDateString()}</td>
              <td data-label="Location">{c.address}</td>
              <td data-label="Registered Donors">{c.targetUnits - c.remainingUnits} / {c.targetUnits}</td>
              <td data-label="Status">{c.requestStatus}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(c)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(c.requestId)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirm
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.requesterName : 'this campaign'}
      />

      {showForm && (
        <CampaignForm
          visible={showForm}
          initial={editing}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
});

export default CampaignsTable;
