import { useContext } from "react";
import { Modal } from "react-bootstrap";
import AuthContext from "../../services/authContext/AuthContext";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";

const AuthModal = () => {
	const { showAuthModal, setShowAuthModal, modalView } = useContext(AuthContext);

	return (
		<Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} centered>
			<Modal.Body>
				{modalView === "login" ? <LoginForm /> : <RegisterForm />}
			</Modal.Body>
		</Modal>
	);
};

export default AuthModal;

