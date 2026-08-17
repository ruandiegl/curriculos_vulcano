import styled from 'styled-components';

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

export const MetricCard = styled.div`
  min-width: 118px;
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
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 560px) {
    padding: 14px;
    gap: 12px;
  }
`;

export const SearchInputWrapper = styled.div`
  min-height: 46px;
  width: min(100%, 430px);
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  flex: 1 1 280px;

  @media (max-width: 560px) {
    min-height: auto;
    width: 100%;
    flex-basis: 100%;
    align-items: stretch;
    flex-wrap: wrap;
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  height: 38px;
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

  @media (max-width: 560px) {
    flex: 1 1 190px;
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

  @media (max-width: 420px) {
    width: 100%;
  }
`;

export const ScopeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex: 999 1 460px;
`;

export const ScopeButton = styled.button<{ $active?: boolean }>`
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

export const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const FormSection = styled.form`
  padding: 22px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormTitle = styled.h2`
  margin: 0;
  color: #102a43;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 900;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #475569;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
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
  text-transform: none;

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

export const CheckboxRow = styled.label`
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 12px;
  font-weight: 900;

  input {
    width: 16px;
    height: 16px;
    accent-color: #ff8424;
  }
`;

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Button = styled.button<{ $secondary?: boolean; $danger?: boolean }>`
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: ${({ $secondary, $danger }) => {
    if ($danger) return '#ef4444';
    return $secondary ? '#e2e8f0' : '#ff8424';
  }};
  color: ${({ $secondary }) => ($secondary ? '#334155' : '#fff')};
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: ${({ $secondary, $danger }) => {
      if ($danger) return '#dc2626';
      return $secondary ? '#cbd5e1' : '#fb7900';
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const actionVariantColor = {
  edit: '#38a6f4',
  delete: '#ef4444',
  default: '#102a43',
};

export const IconActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
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

  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    flex-basis: 44px;
  }
`;

export const TableSection = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 767px) {
    overflow-x: visible;
    border: 0;
    background: transparent;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 780px;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;

  thead {
    background: #11182d;
    color: #faf7f3;
  }

  th {
    padding: 12px 18px;
    border-bottom: 1px solid #eadfd6;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  td {
    padding: 17px 18px;
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

  @media (max-width: 767px) {
    min-width: 0;
    display: block;

    colgroup,
    thead {
      display: none;
    }

    tbody {
      display: grid;
      gap: 12px;
    }

    tr {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    td {
      min-width: 0;
      padding: 0;
      border-bottom: 0;
      display: grid;
      grid-template-columns: 84px minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      overflow: visible;
      text-overflow: clip;
      white-space: normal;
    }

    td::before {
      content: attr(data-label);
      color: #64748b;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
    }
  }
`;

export const UserCell = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 680px) {
    align-items: flex-start;
  }
`;

export const Avatar = styled.div`
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

export const UserInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong,
  span {
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
  }

  @media (max-width: 680px) {
    strong,
    span {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
`;

export const TypeBadge = styled.span<{ $type: string }>`
  width: fit-content;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ $type }) => ($type === 'superAdmin' ? '#11182d' : $type === 'admin' ? '#fff1dc' : '#eef5fb')};
  color: ${({ $type }) => ($type === 'superAdmin' ? '#fff' : $type === 'admin' ? '#fb7900' : '#334155')};
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 900;
`;

export const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  @media (max-width: 680px) {
    justify-content: flex-start;
  }
`;

export const UserModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.66);

  @media (max-width: 640px) {
    align-items: end;
    padding: 0;
    overflow: hidden;
  }
`;

export const UserModal = styled.form`
  width: 100%;
  background: transparent;

  @media (max-width: 640px) {
    width: 100%;
    width: 100%;
  }
`;

export const UserModalHandle = styled.div`
  display: none;

  @media (max-width: 640px) {
    width: 42px;
    height: 4px;
    margin: 0 auto 2px;
    border-radius: 999px;
    background: #cbd5e1;
    display: block;
    cursor: grab;
  }
`;

export const ModalHeader = styled.header`
  padding: 24px 26px 18px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 640px) {
    padding: 18px 22px 14px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #102a43;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 900;
`;

export const ModalCloseButton = styled.button`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border: 0;
  border-radius: 8px;
  background: #eef5fb;
  color: #334155;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;

  &:hover {
    background: #e2e8f0;
  }
`;

export const ModalBody = styled.div`
  padding: 22px 26px 8px;
  display: grid;
  gap: 16px;

  @media (max-width: 640px) {
    padding: 18px 22px 8px;
  }
`;

export const ModalActions = styled.div`
  padding: 22px 26px 26px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 640px) {
    padding: 18px 22px calc(22px + env(safe-area-inset-bottom));
    flex-direction: column-reverse;
  }
`;

export const StateMessage = styled.div<{ $variant?: 'error' | 'success' | 'default' }>`
  padding: 14px 16px;
  border-radius: 8px;
  background: ${({ $variant }) => {
    if ($variant === 'error') return '#fff1f2';
    if ($variant === 'success') return '#ecfdf5';
    return '#fff';
  }};
  color: ${({ $variant }) => {
    if ($variant === 'error') return '#991b1b';
    if ($variant === 'success') return '#047857';
    return '#475569';
  }};
  font-size: 13px;
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

  @media (max-width: 767px) {
    width: 44px;
    min-width: 44px;
    height: 44px;
    min-height: 44px;
  }
`;
