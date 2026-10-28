import React, { useState, useRef } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@agrobotanical.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch {
      setError('Error al conectar con el servidor de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <style>{`
        .login-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #F8F9F5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          user-select: none;
        }

        /* ── Video de fondo full cover sin controles, en bucle continuo ── */
        .login-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right center;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Header superior ── */
        .login-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 28px clamp(24px, 5vw, 56px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }
        .login-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .login-logo-img {
          height: 46px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
        }

        .login-nav-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        }
        .login-nav-btn {
          background: none;
          border: none;
          padding: 4px 6px;
          color: inherit;
          font-family: inherit;
          font-size: 15px;
          font-weight: inherit;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .login-nav-btn.active {
          opacity: 1;
          font-weight: 700;
        }
        .login-nav-btn:not(.active) {
          opacity: 0.78;
        }
        .login-nav-btn:hover {
          opacity: 1;
          transform: translateY(-1px);
        }
        .login-nav-divider {
          opacity: 0.55;
          user-select: none;
        }

        /* ── Contenedor principal del formulario ── */
        .login-main {
          position: relative;
          z-index: 5;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding-left: clamp(28px, 7vw, 110px);
          padding-right: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          animation: loginFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Título ── */
        .login-title {
          margin: 0 0 34px 0;
          font-size: clamp(28px, 2.5vw, 36px);
          font-weight: 800;
          color: #173824;
          line-height: 1.22;
          letter-spacing: -0.02em;
        }

        /* ── Campos de entrada ── */
        .login-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 24px;
        }

        .login-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #556B5A;
          margin-bottom: 6px;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 1.5px solid #CAD5CD;
          transition: border-color 0.25s ease;
        }
        .login-input-wrap:focus-within {
          border-bottom-color: #2D6A4F;
        }

        .login-input {
          width: 100%;
          border: none;
          background: transparent;
          padding: 9px 0;
          font-size: 15px;
          color: #173824;
          font-family: inherit;
          outline: none;
          transition: color 0.2s;
        }
        .login-input::placeholder {
          color: #8C9F92;
          font-weight: 400;
          font-size: 14px;
        }

        .login-eye-btn {
          background: none;
          border: none;
          padding: 6px;
          color: #556B5A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .login-eye-btn:hover {
          color: #173824;
        }

        .login-forgot-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
          margin-bottom: 30px;
        }
        .login-forgot-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #2D6A4F;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: color 0.15s, text-decoration 0.15s;
        }
        .login-forgot-link:hover {
          color: #1B4332;
          text-decoration: underline;
        }

        /* ── Botón LOGIN verde degradado ── */
        .login-submit-btn {
          width: 100%;
          border: none;
          border-radius: 9999px;
          padding: 13.5px 24px;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
          background: linear-gradient(90deg, #6EC028 0%, #3EA038 52%, #1F6B2D 100%);
          box-shadow: 0 8px 22px rgba(62, 160, 56, 0.36);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, filter 0.2s ease;
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(62, 160, 56, 0.46);
          filter: brightness(1.05);
        }
        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 14px rgba(62, 160, 56, 0.3);
        }
        .login-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          filter: grayscale(0.2);
        }

        /* ── Social login inferior ── */
        .login-social-section {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .login-social-label {
          font-size: 12.5px;
          color: #556B5A;
          font-weight: 500;
        }
        .login-social-icons {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .login-social-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #173824;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .login-social-btn:hover {
          transform: scale(1.18);
          color: #2D6A4F;
        }

        /* ── Alert de error ── */
        .login-error {
          margin-bottom: 18px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(229, 72, 77, 0.12);
          border: 1px solid rgba(229, 72, 77, 0.3);
          color: #C5221F;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 820px) {
          .login-main {
            padding: 90px 24px 32px;
            background: linear-gradient(180deg, rgba(248,249,245,0.92) 0%, rgba(248,249,245,0.85) 100%);
            backdrop-filter: blur(8px);
          }
          .login-card {
            max-width: 100%;
          }
        }
      `}</style>

      {/* ── VIDEO DE FONDO: reproduce en bucle, sin audio ni controles ── */}
      <video
        ref={videoRef}
        className="login-video-bg"
        src="/assets/login/loginBackground.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        aria-hidden="true"
      />

      {/* ── BARRA SUPERIOR: Logo + Sign In | Sign Up ── */}
      <header className="login-header">
        <div className="login-logo-wrap">
          <img
            src="/assets/logosNativos/AgroBotanicalLogo.png"
            alt="AGRO botanical"
            className="login-logo-img"
          />
        </div>

        <nav className="login-nav-tabs" aria-label="Navegación de acceso">
          <button
            type="button"
            className={`login-nav-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Iniciar Sesión
          </button>
          <span className="login-nav-divider">|</span>
          <button
            type="button"
            className={`login-nav-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Registrarse
          </button>
        </nav>
      </header>

      {/* ── FORMULARIO PRINCIPAL (Alineado a la izquierda sobre la silueta clara) ── */}
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">
            {activeTab === 'signin' ? (
              <>
                ¡Qué tal, agrónomo!<br />
                Bienvenido a AGRO Botanical
              </>
            ) : (
              <>
                ¡Únete al equipo agrónomo!<br />
                Registro AGRO Botanical
              </>
            )}
          </h1>

          {error && (
            <div className="login-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo EMAIL */}
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">
                CORREO ELECTRÓNICO
              </label>
              <div className="login-input-wrap">
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Campo PASSWORD */}
            <div className="login-field" style={{ marginBottom: 0 }}>
              <label htmlFor="login-password" className="login-label">
                CONTRASEÑA
              </label>
              <div className="login-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Enlace Olvidé contraseña */}
            <div className="login-forgot-wrap">
              <button
                type="button"
                className="login-forgot-link"
                onClick={() => alert('Recuperación de contraseña: Por favor contacta al administrador del sistema AGRO Botanical.')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón LOGIN verde degradado */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>INGRESANDO...</span>
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'ENTRAR AL SISTEMA' : 'SOLICITAR ACCESO'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Iconos sociales inferiores */}
          <div className="login-social-section">
            <span className="login-social-label">O accede directamente con:</span>
            <div className="login-social-icons">
              {/* Google */}
              <button
                type="button"
                className="login-social-btn"
                title="Acceder con Google"
                aria-label="Acceder con Google"
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.82h5.05c-.215 1.455-1.575 4.26-5.05 4.26-3.04 0-5.525-2.52-5.525-5.63s2.485-5.63 5.525-5.63c1.73 0 2.885.74 3.545 1.375l2.805-2.705C16.815 3.79 14.73 2.9 12.24 2.9 7.155 2.9 3 7.055 3 12.14s4.155 9.24 9.24 9.24c5.335 0 8.875-3.75 8.875-9.03 0-.61-.065-1.07-.15-1.53h-8.725z" />
                </svg>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                className="login-social-btn"
                title="Acceder con X"
                aria-label="Acceder con X"
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="login-social-btn"
                title="Acceder con Facebook"
                aria-label="Acceder con Facebook"
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
