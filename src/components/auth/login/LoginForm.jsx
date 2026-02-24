import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import AuthContext from "../../../services/authContext/AuthContext.js";
import useLowercaseEmail from "../../../hooks/useLowercaseEmail";
import logo from "../../../assets/hemalink_isotype.png";

const PENDING_ERROR = "Requester account is not accepted yet.";

const Login = () => {
  const [username, setUsername] = useLowercaseEmail("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const { login, setModalView } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(username, password);
    if (res.ok) {
      navigate("/");
    } else if (Array.isArray(res.errors) && res.errors.includes(PENDING_ERROR)) {
      setShowPending(true);
    } else {
      setError(res.message || res.errors?.[0] || "Invalid credentials");
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <img src={logo} alt="HemaLink" style={{ width: 64, height: 64, marginBottom: 12 }} />
        <h4 style={{ fontWeight: 700 }}>Welcome to HemaLink</h4>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Sign in to manage your campaigns and donations</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Modal show={showPending} onHide={() => setShowPending(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Pending Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your account is still pending approval by a moderator. You will be able to log in once your account has been approved.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPending(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-2" controlId="formUser">
          <Form.Control
            type="text"
            placeholder="Email"
            value={username}
            onChange={setUsername}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-grid mb-3">
          <Button type="submit" variant="danger">
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Don't have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); setModalView('register'); }}>Register as an Entity</a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
