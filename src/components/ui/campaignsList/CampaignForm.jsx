import { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
import { ALL_BLOOD_TYPES, formatBloodType } from './campaigns.services';
import { getRequesters } from '../entities/entities.services';

const toDatetimeLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CampaignForm = ({ initial = null, onSave, onClose, visible = true, hideRequester = false }) => {
  const isEditing = !!initial;
  const showRequester = !isEditing && !hideRequester;
  const [form, setForm] = useState({
    requesterId: '',
    requestDate: '',
    address: '',
    bloodTypesNeeded: [],
    targetUnits: 1,
  });
  const [errors, setErrors] = useState({});
  const [requesters, setRequesters] = useState([]);

  useEffect(() => {
    if (showRequester) {
      getRequesters()
        .then(setRequesters)
        .catch(() => setRequesters([]));
    }
  }, [showRequester]);

  useEffect(() => {
    if (initial) {
      setForm({
        requesterId: '',
        requestDate: toDatetimeLocal(initial.requestDate),
        address: initial.address || '',
        bloodTypesNeeded: initial.bloodTypesNeeded || [],
        targetUnits: initial.targetUnits ?? 1,
      });
    } else {
      setForm({ requesterId: '', requestDate: '', address: '', bloodTypesNeeded: [], targetUnits: 1 });
    }
    setErrors({});
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'targetUnits' ? Number(value) : value }));
  };

  const toggleBloodType = (bt) => {
    setForm((f) => {
      const current = f.bloodTypesNeeded;
      return {
        ...f,
        bloodTypesNeeded: current.includes(bt)
          ? current.filter((t) => t !== bt)
          : [...current, bt],
      };
    });
  };

  const validate = () => {
    const e = {};
    if (showRequester && !form.requesterId) e.requesterId = 'Select a requester';
    if (!form.requestDate) e.requestDate = 'Date is required';
    else if (!isEditing && new Date(form.requestDate) < new Date()) e.requestDate = 'Date cannot be in the past';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.bloodTypesNeeded.length) e.bloodTypesNeeded = 'Select at least one blood type';
    if (!form.targetUnits || form.targetUnits < 1) e.targetUnits = 'Must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      requestDate: new Date(form.requestDate).toISOString(),
      address: form.address.trim(),
      bloodTypesNeeded: form.bloodTypesNeeded,
      targetUnits: form.targetUnits,
    };
    if (showRequester) payload.requesterId = Number(form.requesterId);
    onSave(payload);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>{initial ? 'Edit Campaign' : 'New Campaign'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={submit} className="donor-form">
          {showRequester && (
            <label>
              Requester
              <select
                name="requesterId"
                value={form.requesterId}
                onChange={handleChange}
              >
                <option value="">-- Select a requester --</option>
                {requesters.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {errors.requesterId && <span className="text-danger small">{errors.requesterId}</span>}
            </label>
          )}
          <label>
            Date
            <input
              type="datetime-local"
              name="requestDate"
              value={form.requestDate}
              onChange={handleChange}
              {...(!isEditing ? { min: toDatetimeLocal(new Date().toISOString()) } : {})}
            />
            {errors.requestDate && <span className="text-danger small">{errors.requestDate}</span>}
          </label>
          <label>
            Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Campaign address"
            />
            {errors.address && <span className="text-danger small">{errors.address}</span>}
          </label>
          <label>
            Target Donors
            <input
              type="number"
              name="targetUnits"
              min="1"
              value={form.targetUnits}
              onChange={handleChange}
            />
            {errors.targetUnits && <span className="text-danger small">{errors.targetUnits}</span>}
          </label>
          <label>Blood Types Needed</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {ALL_BLOOD_TYPES.map((bt) => (
              <button
                key={bt}
                type="button"
                className={`btn btn-sm ${form.bloodTypesNeeded.includes(bt) ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => toggleBloodType(bt)}
              >
                {formatBloodType(bt)}
              </button>
            ))}
          </div>
          {errors.bloodTypesNeeded && <span className="text-danger small">{errors.bloodTypesNeeded}</span>}
        </form>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={submit}>
          Save
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CampaignForm;
