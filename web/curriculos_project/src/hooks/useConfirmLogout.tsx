import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAuth } from './useAuth';

export function useConfirmLogout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function requestLogout() {
    setLogoutOpen(true);
  }

  function confirmLogout() {
    signOut();
    navigate('/');
  }

  const logoutModal = logoutOpen ? (
    <ConfirmModal
      title="Sair da conta?"
      description="Você será redirecionado para a tela de login. Confirme para encerrar sua sessão."
      confirmLabel="Sair"
      tone="default"
      onCancel={() => setLogoutOpen(false)}
      onConfirm={confirmLogout}
    />
  ) : null;

  return { requestLogout, logoutModal };
}
