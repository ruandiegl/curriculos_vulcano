import styled from 'styled-components';
import { getStatusColor } from '../../utils/status';

const sidebarWidth = '272px';
const sidebarClosedWidth = '72px';

export const Page = styled.div<{ $sidebarOpen: boolean }>`
  height: 100vh;
  display: grid;
  grid-template-columns: ${({ $sidebarOpen }) => ($sidebarOpen ? sidebarWidth : sidebarClosedWidth)} minmax(0, 1fr);
  background: #f4f7fb;
  color: #223044;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  overflow: hidden;
  transition: grid-template-columns 180ms ease;
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

export const MenuButton = styled.button<{ $floating?: boolean }>`
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
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    padding: 18px 12px 28px;
  }
`;

export const Content = styled.section`
  width: min(100%, 1180px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ContentHeader = styled.div`
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCategory = styled.span`
  display: block;
  margin-bottom: 6px;
  color: #ff8424;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h1`
  margin: 0;
  color: #102a43;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 900;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(96px, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  min-width: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #eef5fb;

  span {
    display: block;
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 2px;
    color: #102a43;
    font-size: 22px;
    line-height: 1;
    font-weight: 900;
  }
`;

export const SearchSection = styled.section`
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const SearchActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 740px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchContainer = styled.form`
  display: flex;
  min-width: 0;
  flex: 1 1 320px;
`;

export const SearchInputWrapper = styled.div`
  width: min(100%, 520px);
  min-height: 46px;
  padding: 4px;
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 740px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  height: 100%;
  padding: 0 14px;
  border: 0;
  background: transparent;
  color: #223044;
  font-size: 13px;
  font-weight: 700;
  outline: none;

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ClearButton = styled.button`
  width: 88px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: #e2e8f0;
  color: #334155;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    background: #cbd5e1;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex: 999 1 460px;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#ff8424' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#64748b')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    background: ${({ $active }) => ($active ? '#ff8424' : '#f1f5f9')};
    color: ${({ $active }) => ($active ? '#fff' : '#102a43')};
  }
`;

export const FilterBadge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
`;

export const Dot = styled.span<{ $status: string; $large?: boolean }>`
  width: ${({ $large }) => ($large ? '16px' : '12px')};
  height: ${({ $large }) => ($large ? '16px' : '12px')};
  display: inline-block;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.22);
  background: ${({ $status }) => getStatusColor($status)};
`;

export const StateMessage = styled.div<{ $variant?: 'error' | 'default' }>`
  padding: 22px 16px;
  border-left: ${({ $variant }) => ($variant === 'error' ? '4px solid #dc2626' : '0')};
  background: ${({ $variant }) => ($variant === 'error' ? '#fff1f2' : '#fff')};
  color: ${({ $variant }) => ($variant === 'error' ? '#991b1b' : '#475569')};
  font-size: 13px;
  font-weight: 800;
  text-align: ${({ $variant }) => ($variant === 'error' ? 'left' : 'center')};
`;

export const TableSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 880px;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;

  thead {
    background: #11182d;
    color: #faf7f3;
  }

  th {
    padding: 12px 20px;
    border-bottom: 1px solid #eadfd6;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  td {
    padding: 20px;
    border-bottom: 1px solid #f0e7df;
    color: #334155;
    font-size: 13px;
    font-weight: 700;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr[role='button'] {
    cursor: pointer;
  }

  tbody tr:hover td {
    background: #f8fafc;
  }

  tbody tr[role='button']:focus-visible td {
    background: #fff7ed;
    outline: 2px solid #ff8424;
    outline-offset: -2px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-width: max-content;
`;

export const ActionButton = styled.button`
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  color: #102a43;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    border-color: #ff8424;
    color: #fb7900;
  }
`;

export const ActionLink = styled(ActionButton)``;

const actionVariantColor = {
  view: '#10b981',
  edit: '#38a6f4',
  delete: '#ef4444',
  default: '#102a43',
};

export const IconActionButton = styled.button<{ $variant?: 'view' | 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  flex: 0 0 32px;
  padding: 0;
  border: 1px solid ${({ $variant }) => actionVariantColor[$variant ?? 'default']};
  border-radius: 10px;
  background: ${({ $variant }) => `${actionVariantColor[$variant ?? 'default']}12`};
  color: ${({ $variant }) => actionVariantColor[$variant ?? 'default']};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    background: ${({ $variant }) => `${actionVariantColor[$variant ?? 'default']}22`};
  }
`;

export const CandidateCell = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const CandidateAvatar = styled.div`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 50%;
  background: #fff1dc;
  color: #fb7900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
`;

export const CandidateInfo = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong,
  span {
    min-width: 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #102a43;
    font-size: 13px;
    font-weight: 800;
  }

  span {
    color: #8b7d72;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StatusPill = styled.span<{ $status: string }>`
  width: fit-content;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ $status }) => `${getStatusColor($status)}18`};
  color: ${({ $status }) => getStatusColor($status)};
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
`;

export const Pagination = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) => ($active ? '#ff8424' : '#102a43')};
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    background: #fb7900;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  width: fit-content;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: ${({ $active }) => ($active ? 'rgba(22, 163, 74, 0.14)' : 'rgba(100, 116, 139, 0.14)')};
  color: ${({ $active }) => ($active ? '#15803d' : '#475569')};
  font-size: 12px;
  font-weight: 800;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const SubmitButton = styled.button`
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: #ff8424;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: #fb7900;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.68;
  }
`;

export const CloseButton = styled(SubmitButton)`
  background: #e2e8f0;
  color: #334155;

  &:hover {
    background: #cbd5e1;
  }
`;

export const FormSection = styled.section`
  padding: 24px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'auto')};
`;

export const Label = styled.label`
  color: #475569;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const CharacterCounter = styled.span`
  align-self: flex-end;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #223044;
  font-size: 14px;
  font-weight: 700;
  outline: none;

  &:focus {
    border-color: #ff8424;
    box-shadow: 0 0 0 3px rgba(255, 132, 36, 0.16);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #223044;
  font-size: 14px;
  font-weight: 700;
  outline: none;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 92px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #223044;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #ff8424;
    box-shadow: 0 0 0 3px rgba(255, 132, 36, 0.16);
  }
`;

export const FormActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 22px 0;

  div {
    min-width: 0;
    padding: 14px;
    border-radius: 8px;
    background: #eef5fb;
  }

  strong {
    display: block;
    margin-bottom: 6px;
    color: #64748b;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  span {
    display: block;
    color: #102a43;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.p`
  margin: 16px 0 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
`;
