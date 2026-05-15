import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import logo from '../media/logo.png';
import solda from '../media/solda.jpg';

function LoginIcon() {
  return (
    <span className="login-icon" aria-hidden="true">
      <span className="icon-head" />
      <span className="icon-body" />
      <span className="icon-plus icon-plus-horizontal" />
      <span className="icon-plus icon-plus-vertical" />
    </span>
  );
}

function App() {
  const hideMissingImage = (event) => {
    event.currentTarget.classList.add('is-missing');
  };

  return (
    <main className="page-shell">
      <section className="login-card" aria-label="Tela de login">
        <div className="login-panel">
          <div className="brand" aria-label="Metalurgica Vulcano">
            <img src={logo} alt="Metalurgica Vulcano" onError={hideMissingImage} />
            <div className="brand-fallback" aria-hidden="true">
              <span className="mark">M</span>
              <span className="brand-copy">
                <small>Metalurgica</small>
                <strong>VULCANO</strong>
                <em>www.e-vulcano.com.br</em>
              </span>
            </div>
          </div>

          <form className="login-form">
            <h1>Faça seu Login</h1>

            <label className="field">
              <span>Email</span>
              <input type="email" placeholder="Email" autoComplete="email" />
            </label>

            <label className="field">
              <span>Senha</span>
              <input type="password" placeholder="Senha" autoComplete="current-password" />
            </label>

            <button className="login-button" type="submit">
              <LoginIcon />
              <span>Login</span>
            </button>
          </form>

          <a className="forgot-link" href="#">
            Esqueci minha senha
          </a>

          <p className="signup-copy">
            Não tem uma conta? <a href="#">Cadastro</a>
          </p>
        </div>

        <div className="photo-panel" aria-hidden="true">
          <img src={solda} alt="" onError={hideMissingImage} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
