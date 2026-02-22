import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const PromoteConfirm = ({ visible = false, onClose, onConfirm, moderatorName = 'this moderator' }) => {
  return (
    <CModal visible={visible} onClose={onClose} backdrop>
      <CModalHeader>
        <CModalTitle>Promote to Admin</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to promote <strong>{moderatorName}</strong> to Admin?
      </CModalBody>
      <CModalFooter>
        <CButton color="warning" onClick={onConfirm}>
          Promote
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PromoteConfirm;
