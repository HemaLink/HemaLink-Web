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
    type: initial?.type || '',
    contact: initial?.contact || '',
    phone: initial?.phone || '',
    address: initial?.address || '',
    createdAt: initial?.createdAt || '',
    isActive: initial?.isActive ?? true,
  });

  useEffect(() => {
    setForm({
      id: initial?.id || null,
      name: initial?.name || '',
      type: initial?.type || '',
      contact: initial?.contact || '',
      phone: initial?.phone || '',
      address: initial?.address || '',
      createdAt: initial?.createdAt || '',
      isActive: initial?.isActive ?? true,
    });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onSave(form);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>{form.id ? 'Edit Entity' : 'Add Entity'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={submit} className="donor-form">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Type
            <input name="type" value={form.type} onChange={handleChange} />
          </label>
          <label>
            Contact
            <input name="contact" value={form.contact} onChange={handleChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={handleChange} />
          </label>
          <label>
            Created At
            <input type="date" name="createdAt" value={form.createdAt} onChange={handleChange} />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
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
