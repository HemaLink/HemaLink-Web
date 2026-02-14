import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const DeleteConfirm = ({ visible = false, onClose, onConfirm, itemName = 'this item' }) => {
  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>Are you sure you want to delete {itemName}?</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={onConfirm}>
          Delete
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteConfirm;
