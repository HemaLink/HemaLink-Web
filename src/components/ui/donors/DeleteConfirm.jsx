import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const DeleteConfirm = ({ visible = false, onClose, onConfirm, itemName = 'this item', title = 'Confirm Delete', actionLabel = 'Delete', actionVerb = 'delete' }) => {
  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>Are you sure you want to {actionVerb} {itemName}?</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={onConfirm}>
          {actionLabel}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteConfirm;
