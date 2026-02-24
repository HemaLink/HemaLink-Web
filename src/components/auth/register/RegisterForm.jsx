import { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import AuthContext from "../../../services/authContext/AuthContext.js";
import useLowercaseEmail from "../../../hooks/useLowercaseEmail";
import logo from "../../../assets/hemalink_isotype.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail, resetEmail] = useLowercaseEmail("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const { setModalView, register } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailError(null);
    const res = await register(name, email, password);
    if (res.ok) {
      setSuccess("Registration successful! Your account is pending approval.");
      setTimeout(() => setModalView("login"), 2000);
    } else if (Array.isArray(res.errors) && res.errors.includes("This email is already used.")) {
      setEmailError("This email is already in use.");
    } else {
      setError(res.message || res.errors?.[0] || "Registration failed");
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <img src={logo} alt="HemaLink" style={{ width: 64, height: 64, marginBottom: 12 }} />
        <h4 style={{ fontWeight: 700 }}>Entity Registration</h4>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Register your organization to start creating donation campaigns</p>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-2" controlId="formName">
          <Form.Control
            type="text"
            placeholder="Entity / Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Contact Email"
            value={email}
            onChange={(e) => { setEmail(e); setEmailError(null); }}
            isInvalid={!!emailError}
            required
          />
          {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
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
            Register as Donor Entity
          </Button>
        </div>
        <div className="text-center">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Already have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); setModalView('login'); }}>Sign in</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
