import styled from 'styled-components';

const sidebarWidth = '272px';
const sidebarClosedWidth = '72px';

export const AdminPage = styled.div<{ $sidebarOpen: boolean }>`
  height: 100vh;
  display: grid;
  grid-template-columns: ${({ $sidebarOpen }) => ($sidebarOpen ? sidebarWidth : sidebarClosedWidth)} minmax(0, 1fr);
  background: #f4f7fb;
  color: #223044;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  overflow: hidden;
  transition: grid-template-columns 180ms ease;

  @media (max-width: 640px) {
    grid-template-columns: ${({ $sidebarOpen }) => ($sidebarOpen ? '1fr' : '64px minmax(0, 1fr)')};
  }
`;

export const Sidebar = styled.aside<{ $open: boolean }>`
  height: 100vh;
  min-width: 0;
  padding: ${({ $open }) => ($open ? '18px 16px' : '18px 10px')};
  display: flex;
  flex-direction: column;
  align-items: ${({ $open }) => ($open ? 'stretch' : 'center')};
  gap: 24px;
  background: #11182d;
  color: #fff;
  box-shadow: 10px 0 28px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  z-index: 4;

  @media (max-width: 640px) {
    padding: ${({ $open }) => ($open ? '14px 12px' : '14px 8px')};
    gap: 16px;
    width: ${({ $open }) => ($open ? '100vw' : '64px')};
    max-width: 100vw;
    position: ${({ $open }) => ($open ? 'fixed' : 'relative')};
    inset: ${({ $open }) => ($open ? '0' : 'auto')};
    z-index: ${({ $open }) => ($open ? 40 : 4)};
  }
`;

export const SidebarHeader = styled.div<{ $open: boolean }>`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: ${({ $open }) => ($open ? 'space-between' : 'center')};
  gap: 14px;
`;

export const Brand = styled.div`
  height: 48px;
  display: inline-flex;
  align-items: center;

  img {
    max-width: 168px;
    max-height: 48px;
    display: block;
    object-fit: contain;
  }
`;

export const MenuButton = styled.button`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  span {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  @media (max-width: 640px) {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
`;

export const NavButton = styled.button<{ $active?: boolean; $open: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: ${({ $open }) => ($open ? '0 14px' : '0')};
  border: 0;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#ff8424' : 'transparent')};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${({ $open }) => ($open ? 'flex-start' : 'center')};
  gap: 12px;
  font-size: 13px;
  font-weight: 800;
  text-align: left;

  svg {
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    border-radius: 8px;
    padding: 6px;
    background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .nav-label {
    display: ${({ $open }) => ($open ? 'inline' : 'none')};
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#ff8424' : 'rgba(255, 255, 255, 0.1)')};
  }

  @media (max-width: 640px) {
    min-height: 42px;
    padding: ${({ $open }) => ($open ? '0 12px' : '0')};

    svg {
      width: 28px;
      height: 28px;
      flex-basis: 28px;
    }
  }
`;

export const SidebarFooter = styled.div<{ $open: boolean }>`
  width: 100%;
  margin-top: auto;
  padding: ${({ $open }) => ($open ? '12px' : '8px 0')};
  border-radius: 8px;
  background: ${({ $open }) => ($open ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  display: flex;
  flex-direction: ${({ $open }) => ($open ? 'row' : 'column')};
  align-items: center;
  justify-content: ${({ $open }) => ($open ? 'space-between' : 'center')};
  gap: ${({ $open }) => ($open ? '10px' : '8px')};
`;

export const LogoutButton = styled.button`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8b94ad;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const SidebarUser = styled.div<{ $open: boolean }>`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $open }) => ($open ? 'flex-start' : 'center')};
  gap: 10px;
`;

export const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 50%;
  background: #ff8424;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
`;

export const UserInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #fff;
    font-size: 12px;
    font-weight: 800;
  }

  span {
    color: #8b94ad;
    font-size: 12px;
    font-weight: 600;
  }
`;

export const Main = styled.main`
  min-width: 0;
  height: 100vh;
  padding: 32px 28px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: 16px 10px 28px;
  }
`;
