import { useState, useEffect, useMemo } from 'react';
import { getOwnBloodRequests, formatBloodType, REQUEST_STATUSES, createRequesterBloodRequest, updateRequesterBloodRequest, cancelRequesterBloodRequest } from '../campaignsList/campaigns.services';
import CampaignForm from '../campaignsList/CampaignForm';
import DeleteConfirm from '../donors/DeleteConfirm';
import '../donors/donors.css';

const addSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const STATUS_COLORS = {
  Open: '#28a745',
  Completed: '#007bff',
  Expired: '#fd7e14',
  Cancelled: '#dc3545',
};

const YourCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const [sortKey, setSortKey] = useState('requestDate');
  const [sortDir, setSortDir] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showCancel, setShowCancel] = useState(false);

  const fetchCampaigns = (statuses) => {
    setLoading(true);
    getOwnBloodRequests(statuses)
      .then((data) => { setCampaigns(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOwnBloodRequests(statusFilter)
      .then((data) => { if (!cancelled) { setCampaigns(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [statusFilter]);

  const toggleStatus = (s) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

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

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (campaign) => {
    setEditing(campaign);
    setShowForm(true);
  };

  const handleCancel = (campaign) => {
    setCancelTarget(campaign);
    setShowCancel(true);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelRequesterBloodRequest(cancelTarget.requestId);
      fetchCampaigns(statusFilter);
    } catch (err) {
      alert(err.message);
    }
    setShowCancel(false);
    setCancelTarget(null);
  };

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateRequesterBloodRequest(editing.requestId, payload);
      } else {
        await createRequesterBloodRequest(payload);
      }
      setShowForm(false);
      setEditing(null);
      fetchCampaigns(statusFilter);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-2 mx-4">
      <div className="page-title-row">
        <h1>Your Campaigns</h1>
        <button className="btn-add-round" onClick={handleAdd}>
          {addSvg}
        </button>
      </div>
      <CampaignForm
        visible={showForm}
        initial={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSave={handleSave}
        hideRequester
      />
      <DeleteConfirm
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={confirmCancel}
        itemName={cancelTarget ? cancelTarget.requesterName : 'this campaign'}
        title="Confirm Cancel"
        actionLabel="Cancel Campaign"
        actionVerb="cancel"
      />
      <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
        {REQUEST_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn-sm ${statusFilter.includes(s) ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => toggleStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <hr />
      {loading ? (
        <p>Loading your campaigns...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : !sorted.length ? (
        <p>You have no campaigns yet.</p>
      ) : (
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
                <th>Address</th>
                <th>Units</th>
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
                  <td data-label="Address">{c.address}</td>
                  <td data-label="Units">{c.remainingUnits} / {c.targetUnits}</td>
                  <td data-label="Status">
                    <span style={{ color: STATUS_COLORS[c.requestStatus] || 'inherit', fontWeight: 600 }}>
                      {c.requestStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn small" onClick={() => handleEdit(c)}>
                      Edit
                    </button>
                    {c.requestStatus === 'Open' && (
                      <button className="btn small danger" onClick={() => handleCancel(c)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="fab-add" onClick={handleAdd}>
        {addSvg}
      </button>
    </div>
  );
};

export default YourCampaigns;
