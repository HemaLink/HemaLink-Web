import React, { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const EntityForm = ({ initial = null, onSave, onClose, visible = true }) => {
  const [form, setForm] = useState({
    id: initial?.id || null,
    name: initial?.name || '',
    email: initial?.email || '',
    admissionStatus: initial?.admissionStatus ?? 0,
  });

  useEffect(() => {
    setForm({
      id: initial?.id || null,
      name: initial?.name || '',
      email: initial?.email || '',
      admissionStatus: initial?.admissionStatus ?? 0,
    });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'admissionStatus' ? Number(value) : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onSave(form);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>Edit Entity</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={submit} className="donor-form">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Admission Status
            <select name="admissionStatus" value={form.admissionStatus} onChange={handleChange}>
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </label>
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

export default EntityForm;
