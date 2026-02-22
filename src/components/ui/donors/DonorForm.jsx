import { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const DonorForm = ({ initial = null, onSave, onClose, visible = true }) => {
  const [form, setForm] = useState({
    id: initial?.id || null,
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    bloodType: initial?.bloodType || '',
    lastDonation: initial?.lastDonation || '',
    isActive: initial?.isActive ?? true,
  });

  useEffect(() => {
    setForm({
      id: initial?.id || null,
      name: initial?.name || '',
      email: initial?.email || '',
      phone: initial?.phone || '',
      bloodType: initial?.bloodType || '',
      lastDonation: initial?.lastDonation || '',
      isActive: initial?.isActive ?? true,
    });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      return;
    }
    onSave(form);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>Edit Donor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={submit} className="donor-form">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Blood Type
            <input name="bloodType" value={form.bloodType} onChange={handleChange} />
          </label>
          <label>
            Last Donation
            <input type="date" name="lastDonation" value={form.lastDonation} onChange={handleChange} />
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

export default DonorForm;
