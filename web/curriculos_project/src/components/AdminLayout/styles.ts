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

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
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

  @media (max-width: 767px) {
    display: none;
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

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.55);
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
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

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.55);
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
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

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.55);
    outline-offset: 2px;
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

  @media (max-width: 767px) {
    padding: 16px 10px calc(96px + env(safe-area-inset-bottom));
  }
`;

export const BottomNav = styled.nav`
  display: none;

  @media (max-width: 767px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 35;
    min-height: 74px;
    padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(17, 24, 45, 0.98);
    box-shadow: 0 -14px 34px rgba(15, 23, 42, 0.28);
    backdrop-filter: blur(14px);
    display: grid;
    grid-template-columns: repeat(var(--bottom-count, 4), minmax(0, 1fr));
    gap: 4px;
  }
`;

export const BottomNavButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
  min-width: 0;
  min-height: 56px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'rgba(255, 132, 36, 0.16)' : 'transparent')};
  color: ${({ $active, $danger }) => {
    if ($danger) return '#f87171';
    return $active ? '#ff8424' : '#cbd5e1';
  }};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.1;
  font-weight: 900;
  text-align: center;

  svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: ${({ $active }) => ($active ? 'rgba(255, 132, 36, 0.2)' : 'rgba(255, 255, 255, 0.08)')};
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.55);
    outline-offset: -2px;
  }
`;

export const BottomMoreBackdrop = styled.div`
  display: none;

  @media (max-width: 767px) {
    position: fixed;
    inset: 0;
    z-index: 34;
    padding: 0 10px calc(84px + env(safe-area-inset-bottom));
    background: rgba(15, 23, 42, 0.42);
    display: flex;
    align-items: flex-end;
  }
`;

export const BottomMorePanel = styled.div`
  width: 100%;
  max-height: min(420px, 72vh);
  padding: 14px;
  border-radius: 14px 14px 0 0;
  background: #11182d;
  color: #fff;
  box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.36);
  overflow-y: auto;
`;

export const BottomMoreHeader = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  strong {
    font-size: 14px;
    font-weight: 900;
  }

  button {
    min-height: 38px;
    border: 0;
    border-radius: 8px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  button:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.55);
    outline-offset: 2px;
  }
`;

export const BottomMoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;

  ${BottomNavButton} {
    min-height: 48px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    padding: 0 12px;
    font-size: 13px;
    text-align: left;
  }
`;

export const UserBottomNav = styled.nav`
  display: none;

  @media (max-width: 767px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 35;
    min-height: 74px;
    padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
    border-top: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 -14px 34px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(14px);
    display: grid;
    grid-template-columns: repeat(var(--bottom-count, 5), minmax(0, 1fr));
    gap: 4px;
  }
`;

export const UserBottomNavButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
  min-width: 0;
  min-height: 56px;
  border: 0;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? '#fff1e6' : 'transparent')};
  color: ${({ $active, $danger }) => {
    if ($danger) return '#dc2626';
    return $active ? '#ff8424' : '#64748b';
  }};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.1;
  font-weight: 900;
  text-align: center;

  svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#fff1e6' : '#f8fafc')};
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.35);
    outline-offset: -2px;
  }
`;

export const UserBottomMoreBackdrop = styled.div`
  display: none;

  @media (max-width: 767px) {
    position: fixed;
    inset: 0;
    z-index: 34;
    padding: 0 10px calc(84px + env(safe-area-inset-bottom));
    background: rgba(15, 23, 42, 0.42);
    display: flex;
    align-items: flex-end;
  }
`;

export const UserBottomMorePanel = styled.div`
  width: 100%;
  max-height: min(520px, 78vh);
  padding: 14px;
  border-radius: 16px 16px 0 0;
  background: #fff;
  color: #102a43;
  box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.2);
  overflow-y: auto;
`;

export const UserBottomMoreHeader = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  strong {
    font-size: 14px;
    font-weight: 900;
  }

  button {
    min-height: 44px;
    padding: 0 12px;
    border: 0;
    border-radius: 8px;
    background: #eef5fb;
    color: #334155;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
  }

  button:hover {
    background: #e2e8f0;
  }

  button:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.35);
    outline-offset: 2px;
  }
`;

export const UserBottomMoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;

  ${UserBottomNavButton} {
    min-height: 48px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    padding: 0 12px;
    font-size: 13px;
    text-align: left;
  }
`;
