import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-sidebar.png';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { LogoutIcon, MoreIcon } from './navIcons';
import { getAdminNavItems } from './navItems';
import type { AdminNavItem, AdminSection } from './navItems';
import {
  AdminPage,
  BottomMoreBackdrop,
  BottomMoreHeader,
  BottomMoreList,
  BottomMorePanel,
  BottomNav,
  BottomNavButton,
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

type AdminLayoutProps = {
  activeSection?: AdminSection;
  children: ReactNode;
};

const MAX_BOTTOM_NAV_ITEMS = 5;

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'AD';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function AdminLayout({ activeSection = 'curriculos', children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bottomMoreOpen, setBottomMoreOpen] = useState(false);
  const isSuperAdmin = user?.tipo === 'superAdmin';
  const navItems = useMemo(() => getAdminNavItems(user?.tipo), [user?.tipo]);
  const bottomRouteLimit = MAX_BOTTOM_NAV_ITEMS - 1;
  const hasOverflowItems = navItems.length > bottomRouteLimit;
  const visibleBottomItems = hasOverflowItems ? navItems.slice(0, bottomRouteLimit - 1) : navItems;
  const overflowBottomItems = hasOverflowItems ? navItems.slice(bottomRouteLimit - 1) : [];
  const bottomItemCount = visibleBottomItems.length + (hasOverflowItems ? 1 : 0) + 1;
  const isMoreActive = overflowBottomItems.some((item) => item.id === activeSection);
  const userName = user?.nome?.trim() || (user?.tipo === 'admin' || isSuperAdmin ? 'Administrador' : 'Usuário');
  const userEmail = user?.email?.trim() || 'E-mail não informado';
  const userInitials = getInitials(user?.nome, user?.email);

  const navigateTo = (item: AdminNavItem) => {
    setBottomMoreOpen(false);
    navigate(item.path);
  };

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

        <SidebarNav aria-label="Navegação administrativa">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <NavButton
                key={item.id}
                type="button"
                $active={active}
                $open={sidebarOpen}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                onClick={() => navigateTo(item)}
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
      <BottomNav
        aria-label="Navegação administrativa mobile"
        style={{ '--bottom-count': bottomItemCount } as CSSProperties & Record<'--bottom-count', number>}
      >
        {visibleBottomItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <BottomNavButton
              key={item.id}
              type="button"
              $active={active}
              aria-label={item.shortLabel}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigateTo(item)}
            >
              <Icon />
              <span>{item.shortLabel}</span>
            </BottomNavButton>
          );
        })}
        {hasOverflowItems && (
          <BottomNavButton
            type="button"
            $active={isMoreActive}
            aria-label="Abrir mais opções"
            aria-controls="admin-bottom-more"
            aria-expanded={bottomMoreOpen}
            onClick={() => setBottomMoreOpen((current) => !current)}
          >
            <MoreIcon />
            <span>Mais</span>
          </BottomNavButton>
        )}
        <BottomNavButton type="button" $danger aria-label="Sair" onClick={requestLogout}>
          <LogoutIcon />
          <span>Sair</span>
        </BottomNavButton>
      </BottomNav>

      {bottomMoreOpen && (
        <BottomMoreBackdrop onClick={() => setBottomMoreOpen(false)}>
          <BottomMorePanel
            id="admin-bottom-more"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-bottom-more-title"
            onClick={(event) => event.stopPropagation()}
          >
            <BottomMoreHeader>
              <strong id="admin-bottom-more-title">Mais opções</strong>
              <button type="button" onClick={() => setBottomMoreOpen(false)}>
                Fechar
              </button>
            </BottomMoreHeader>
            <BottomMoreList>
              {overflowBottomItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <BottomNavButton
                    key={item.id}
                    type="button"
                    $active={active}
                    aria-label={item.label}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigateTo(item)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </BottomNavButton>
                );
              })}
            </BottomMoreList>
          </BottomMorePanel>
        </BottomMoreBackdrop>
      )}
      {logoutModal}
    </AdminPage>
  );
}
