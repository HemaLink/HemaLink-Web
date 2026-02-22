import { useState, useMemo, useContext } from 'react';
import './donors.css';
import DonorForm from './DonorForm';
import DeleteConfirm from './DeleteConfirm';
import { donors as initial } from '../../../data/donors';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';

const DonorsTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [donors, setDonors] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortMode, setSortMode] = useState('name-asc');

  const handleEdit = (donor) => {
    setEditing(donor);
    setShowForm(true);
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (id) => {
    const donor = donors.find((x) => x.id === id);
    setDeleteTarget(donor);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDonors((d) => d.filter((x) => x.id !== deleteTarget.id));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleSave = (donor) => {
    setDonors((d) => d.map((x) => (x.id === donor.id ? donor : x)));
    setShowForm(false);
  };

  const sorted = useMemo(() => {
    const copy = [...donors];
    switch (sortMode) {
      case 'name-asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-new':
        return copy.sort((a, b) => new Date(b.lastDonation) - new Date(a.lastDonation));
      case 'date-old':
        return copy.sort((a, b) => new Date(a.lastDonation) - new Date(b.lastDonation));
      default:
        return copy;
    }
  }, [donors, sortMode]);

  return (
    <div className="donors-container">
      <div className="donors-toolbar">
        <div className="toolbar-left">
          <label className="sort-label">Sort:</label>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="date-new">Date (new → old)</option>
            <option value="date-old">Date (old → new)</option>
          </select>
        </div>

      </div>

      <table className="donors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Blood</th>
            <th>Last Donation</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => (
            <tr key={d.id} className={d.isActive ? '' : 'muted'}>
              <td data-label="ID">{d.id}</td>
              <td data-label="Name">{d.name}</td>
              <td data-label="Email">{d.email}</td>
              <td data-label="Phone">{d.phone}</td>
              <td data-label="Blood">{d.bloodType}</td>
              <td data-label="Last Donation">{d.lastDonation}</td>
              <td data-label="Active">{d.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(d)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(d.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <DonorForm
          initial={editing}
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirm
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.name : 'this donor'}
      />
    </div>
  );
};

export default DonorsTable;
