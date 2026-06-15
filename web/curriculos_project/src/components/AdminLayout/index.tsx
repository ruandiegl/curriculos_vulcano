import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-sidebar.png';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import {
  AdminPage,
  Brand,
  LogoutButton,
  Main,
  MenuButton,
  NavButton,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarUser,
  UserAvatar,
  UserInfo,
} from './styles';

type AdminSection = 'curriculos' | 'vagas';

type AdminLayoutProps = {
  activeSection?: AdminSection;
  children: ReactNode;
};

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'AD';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function CurriculumIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <path d="M4 13h16M10 13v2h4v-2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M10 12h10M17 9l3 3-3 3" />
    </svg>
  );
}

export function AdminLayout({ activeSection = 'curriculos', children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userName = user?.nome?.trim() || (user?.tipo === 'admin' ? 'Administrador' : 'Usuario');
  const userEmail = user?.email?.trim() || 'Email nao informado';
  const userInitials = getInitials(user?.nome, user?.email);

  return (
    <AdminPage $sidebarOpen={sidebarOpen}>
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader $open={sidebarOpen}>
          {sidebarOpen && (
            <Brand aria-label="Metalurgica Vulcano">
              <img src={logo} alt="Metalurgica Vulcano" />
            </Brand>
          )}
          <MenuButton
            type="button"
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setSidebarOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </MenuButton>
        </SidebarHeader>

        <SidebarNav>
          <NavButton
            type="button"
            $active={activeSection === 'curriculos'}
            $open={sidebarOpen}
            title="Gerenciar Curriculos"
            onClick={() => navigate('/dashboard')}
          >
            <CurriculumIcon />
            <span className="nav-label">Gerenciar Curriculos</span>
          </NavButton>
          <NavButton
            type="button"
            $active={activeSection === 'vagas'}
            $open={sidebarOpen}
            title="Gerenciar Vagas"
            onClick={() => navigate('/newJob')}
          >
            <JobsIcon />
            <span className="nav-label">Gerenciar Vagas</span>
          </NavButton>
        </SidebarNav>

        <SidebarFooter $open={sidebarOpen}>
          <SidebarUser $open={sidebarOpen}>
            <UserAvatar>{userInitials}</UserAvatar>
            {sidebarOpen && (
              <UserInfo>
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </UserInfo>
            )}
          </SidebarUser>
          <LogoutButton type="button" aria-label="Sair" title="Sair" onClick={requestLogout}>
            <LogoutIcon />
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <Main>{children}</Main>
      {logoutModal}
    </AdminPage>
  );
}
