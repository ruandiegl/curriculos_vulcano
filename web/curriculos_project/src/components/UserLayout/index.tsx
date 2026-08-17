import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { AdminPage, Main } from '../AdminLayout/styles';
import {
  Brand,
  LogoutButton,
  MenuButton,
  NavButton,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarUser,
  UserBottomMoreBackdrop,
  UserBottomMoreHeader,
  UserBottomMoreList,
  UserBottomMorePanel,
  UserBottomNav,
  UserBottomNavButton,
  UserAvatar,
  UserInfo,
} from '../AdminLayout/styles';
import logo from '../../assets/logo-sidebar.png';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

const SIDEBAR_STORAGE_KEY = 'userSidebarOpen';
const BOTTOM_TAB_PATHS = ['/profile', '/vagas', '/newCurriculum', '/new-education'];

function getInitialSidebarOpen() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
}

type UserLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  { label: 'Início', path: '/profile', icon: HomeIcon },
  { label: 'Vagas', path: '/vagas', icon: JobsIcon },
  { label: 'Dados pessoais', path: '/newCurriculum', icon: FileIcon },
  { label: 'Endereço', path: '/newAddress', icon: LocationIcon },
  { label: 'Curriculo PDF', path: '/upload-pdf', icon: UploadIcon },
  { label: 'Formação', path: '/new-education', icon: EducationIcon },
  { label: 'Experiência', path: '/new-experience', icon: BriefcaseIcon },
  { label: 'Habilidades', path: '/new-skill', icon: SkillIcon },
  { label: 'Certificacoes', path: '/new-certification', icon: CertificateIcon },
];

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'US';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
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

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5M8 13h8M8 17h6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 8 9-4 9 4-9 4-9-4Z" />
      <path d="M7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <path d="M4 8h16v11H4V8Z" />
      <path d="M9 13h6" />
    </svg>
  );
}

function SkillIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M5 8h14M7 16h10" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v10H7V4Z" />
      <path d="m9 14-1 6 4-2 4 2-1-6" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="19" cy="12" r="1.3" />
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

export function UserLayout({ children }: UserLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarOpen);
  const [bottomMoreOpen, setBottomMoreOpen] = useState(false);
  const userName = user?.nome?.trim() || 'Usuário';
  const userEmail = user?.email?.trim() || 'E-mail não informado';
  const userInitials = getInitials(user?.nome, user?.email);
  const visibleBottomItems = menuItems.filter((item) => BOTTOM_TAB_PATHS.includes(item.path));
  const overflowBottomItems = menuItems.filter((item) => !BOTTOM_TAB_PATHS.includes(item.path));
  const isMoreActive = overflowBottomItems.some((item) => location.pathname === item.path);

  useEffect(() => {
    window.sessionStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    if (!bottomMoreOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBottomMoreOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bottomMoreOpen]);

  function navigateTo(path: string) {
    setBottomMoreOpen(false);
    navigate(path);
  }

  function handleMobileLogout() {
    setBottomMoreOpen(false);
    requestLogout();
  }

  return (
    <AdminPage $sidebarOpen={sidebarOpen}>
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader $open={sidebarOpen}>
          {sidebarOpen && (
            <Brand aria-label="Metalúrgica Vulcano">
              <img src={logo} alt="Metalúrgica Vulcano" />
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
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavButton
                key={item.path}
                type="button"
                $active={location.pathname === item.path}
                $open={sidebarOpen}
                title={item.label}
                onClick={() => navigate(item.path)}
              >
                <Icon />
                <span className="nav-label">{item.label}</span>
              </NavButton>
            );
          })}
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
      <UserBottomNav
        aria-label="Navegação do candidato"
        style={{ '--bottom-count': visibleBottomItems.length + 1 } as CSSProperties & Record<'--bottom-count', number>}
      >
        {visibleBottomItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <UserBottomNavButton
              key={item.path}
              type="button"
              $active={active}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigateTo(item.path)}
            >
              <Icon />
              <span>{item.label === 'Dados pessoais' ? 'Currículo' : item.label}</span>
            </UserBottomNavButton>
          );
        })}
        <UserBottomNavButton
          type="button"
          $active={isMoreActive}
          aria-label="Abrir mais opções"
          aria-controls="user-bottom-more"
          aria-expanded={bottomMoreOpen}
          onClick={() => setBottomMoreOpen((current) => !current)}
        >
          <MoreIcon />
          <span>Mais</span>
        </UserBottomNavButton>
      </UserBottomNav>

      {bottomMoreOpen && (
        <UserBottomMoreBackdrop onClick={() => setBottomMoreOpen(false)}>
          <UserBottomMorePanel
            id="user-bottom-more"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-bottom-more-title"
            onClick={(event) => event.stopPropagation()}
          >
            <UserBottomMoreHeader>
              <strong id="user-bottom-more-title">Mais opções</strong>
              <button type="button" onClick={() => setBottomMoreOpen(false)}>
                Fechar
              </button>
            </UserBottomMoreHeader>
            <UserBottomMoreList>
              {overflowBottomItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <UserBottomNavButton
                    key={item.path}
                    type="button"
                    $active={active}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigateTo(item.path)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </UserBottomNavButton>
                );
              })}
              <UserBottomNavButton type="button" $danger onClick={handleMobileLogout}>
                <LogoutIcon />
                <span>Sair</span>
              </UserBottomNavButton>
            </UserBottomMoreList>
          </UserBottomMorePanel>
        </UserBottomMoreBackdrop>
      )}
      {logoutModal}
    </AdminPage>
  );
}
