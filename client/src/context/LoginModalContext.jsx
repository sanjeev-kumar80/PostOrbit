
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginModalContext = createContext(null);

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  const selectLogin = (role) => {
    setIsOpen(false);
    navigate(role === "admin" ? "/admin-login" : "/user-login");
  };

  return (
    <LoginModalContext.Provider
      value={{ openLoginModal, closeLoginModal }}
    >
      {children}

      {isOpen && (
        <div
          className="login-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLoginModal();
            }
          }}
        >
          <div
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
          >
            <button
              type="button"
              className="login-close"
              onClick={closeLoginModal}
              aria-label="Close login popup"
            >
              ×
            </button>

            <div className="login-modal-icon">P</div>

            <p className="login-eyebrow">WELCOME TO POSTORBIT</p>

            <h2 id="login-title">Welcome Back!</h2>

            <p className="login-description">
              Choose how you want to continue.
            </p>

            <button
              type="button"
              className="login-role-card"
              onClick={() => selectLogin("user")}
            >
              <span className="login-role-icon">👤</span>
              <span className="login-role-content">
                <strong>User Login</strong>
                <small>Manage your posts and social accounts</small>
              </span>
              <span className="login-arrow">→</span>
            </button>

            <button
              type="button"
              className="login-role-card"
              onClick={() => selectLogin("admin")}
            >
              <span className="login-role-icon">⚙</span>
              <span className="login-role-content">
                <strong>Admin Login</strong>
                <small>Manage users and platform activity</small>
              </span>
              <span className="login-arrow">→</span>
            </button>

            <button
              type="button"
              className="login-back"
              onClick={closeLoginModal}
            >
              ← Back to website
            </button>
          </div>
        </div>
      )}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error("useLoginModal must be used inside LoginModalProvider");
  }

  return context;
}
