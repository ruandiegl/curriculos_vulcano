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
`;

export const SearchInputWrapper = styled.div`
  min-height: 46px;
  width: min(100%, 430px);
  padding: 4px;
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  flex: 1 1 280px;
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
`;

export const UserCell = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
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
`;
