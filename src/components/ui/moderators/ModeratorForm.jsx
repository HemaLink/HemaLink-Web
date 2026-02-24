import { useEffect, useState, useCallback } from 'react';
import useLowercaseEmail from '../../../hooks/useLowercaseEmail';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const ModeratorForm = ({ onSave, onClose, visible = true, emailError = null, onEmailErrorClear }) => {
  const [form, setForm] = useState({ name: '', password: '' });
  const [email, setEmail, resetEmail] = useLowercaseEmail('');

  useEffect(() => {
    if (visible) {
      setForm({ name: '', password: '' });
      resetEmail();
    }
  }, [visible, resetEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      if (onEmailErrorClear) onEmailErrorClear();
      setEmail(e);
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !email || !form.password) return;
    onSave({ ...form, email });
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>Add Moderator</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form onSubmit={submit} className="donor-form">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              style={emailError ? { borderColor: '#dc3545' } : {}}
            />
            {emailError && (
              <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: 2, display: 'block' }}>
                {emailError}
              </span>
            )}
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} />
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

export default ModeratorForm;
