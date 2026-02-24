import { Card, Button, Badge, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilCalendar, cilLocationPin, cilDrop } from "@coreui/icons";
import { signUpToDonate, formatBloodType } from "../campaigns.services";
import useLowercaseEmail from "../../../../hooks/useLowercaseEmail";
import "./campaignCard.css";

const CampaignCard = ({
  id,
  requesterName,
  bloodTypesNeeded,
  requestDate,
  address,
  remainingUnits,
  targetUnits,
  requestStatus,
}) => {
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail, resetEmail] = useLowercaseEmail("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(remainingUnits);
  const [localStatus, setLocalStatus] = useState(requestStatus);
  const [hasDonated, setHasDonated] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    resetEmail();
    setFullName("");
    setPhone("");
    setErrors({});
    setSubmitted(false);
  };

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address";
    if (!phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    try {
      await signUpToDonate({
        bloodRequestId: id,
        donorName: fullName.trim(),
        donorEmail: email.trim(),
        donorPhone: phone.trim(),
      });
      const newRemaining = localRemaining - 1;
      setLocalRemaining(newRemaining);
      setHasDonated(true);
      if (newRemaining <= 0) {
        setLocalStatus("Completed");
      }
      closeModal();
      setShowSuccess(true);
    } catch (err) {
      setErrors((prev) => ({ ...prev, api: err.message }));
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "success";
      case "Urgent":
        return "danger";
      case "Completed":
        return "info";
      default:
        return "secondary";
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "O+": "danger",
      "O-": "danger",
      "A+": "primary",
      "A-": "primary",
      "B+": "success",
      "B-": "success",
      "AB+": "warning",
      "AB-": "warning",
    };
    return colors[bloodType] || "dark";
  };

  return (
    <Card
      key={id}
      className="d-flex flex-column campaign-card"
    >
      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Header className="bg-transparent border-0 p-0 m-0 d-flex justify-content-between align-items-center">
          <Card.Title>{requesterName}</Card.Title>
          <div className="d-flex flex-column gap-1 align-items-end">
            {bloodTypesNeeded.map((bt) => (
              <Badge key={bt} className="bloodtype-font" bg={getBloodTypeColor(formatBloodType(bt))}>
                {formatBloodType(bt)}
              </Badge>
            ))}
          </div>
        </Card.Header>
        <Card.Subtitle className={`mb-4 text-${getStatusColor(localStatus)}`}>
          {localStatus}
        </Card.Subtitle>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilCalendar} className="nav-icon" />
            {new Date(requestDate).toLocaleDateString()}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilLocationPin} className="nav-icon" />
            {address}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilDrop} className="nav-icon" />
            Registered Donors {targetUnits - localRemaining} / {targetUnits}
          </div>
        </div>
        {!window.localStorage.getItem("hemalink-token") && (
          <div className="d-flex justify-content-end mt-auto">
            <Button
              variant="outline-primary"
              size="sm"
              className="details-btn"
              onClick={openModal}
              disabled={localStatus === "Completed"}
            >
              {localStatus === "Completed" ? "Completed" : "I Want to Donate"}
            </Button>
          </div>
        )}
      </Card.Body>

      <Modal show={show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donate — {requesterName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Location:</strong> {address}
          </div>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-2" controlId="fullName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isInvalid={submitted && !!errors.fullName}
              />
              {submitted && errors.fullName && (
                <div className="text-danger small mt-1">{errors.fullName}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={setEmail}
                isInvalid={submitted && !!errors.email}
              />
              {submitted && errors.email && (
                <div className="text-danger small mt-1">{errors.email}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-2" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                isInvalid={submitted && !!errors.phone}
              />
              {submitted && errors.phone && (
                <div className="text-danger small mt-1">{errors.phone}</div>
              )}
            </Form.Group>

            {errors.api && (
              <div className="text-danger small mt-2">{errors.api}</div>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={closeModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for signing up! You will be contacted by email soon.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccess(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CampaignCard;
