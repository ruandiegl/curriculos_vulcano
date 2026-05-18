import styled from 'styled-components';
import solda from '../../assets/solda.jpg';

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    desconsiderado: '#dc2626',
    entrevistado: '#fde047',
    selecionado: '#2f8f75',
    visualizado: '#2f70ad',
  };

  return colors[status] ?? '#94a3b8';
}

export const Page = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(239, 245, 250, 0.96), rgba(248, 250, 252, 0.98)),
    url(${solda}) center top / cover fixed;
  color: #2c3547;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
`;

export const Header = styled.header`
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
`;

export const HeaderContent = styled.div`
  width: min(1200px, calc(100% - 48px));
  height: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 720px) {
    width: min(100% - 28px, 1200px);
    height: auto;
    padding: 14px 0;
    align-items: flex-start;
    gap: 16px;
    flex-direction: column;
  }
`;

export const Brand = styled.a`
  display: inline-flex;
  align-items: center;

  img {
    height: 44px;
    width: auto;
    display: block;
  }
`;

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 720px) {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
  }
`;

export const NavLink = styled.a`
  color: #063e66;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: #fb7900;
  }
`;

export const LogoutButton = styled.button`
  min-width: 70px;
  height: 36px;
  border: 0;
  border-radius: 4px;
  background: #ff8424;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;

  &:hover {
    background: #fb7900;
  }
`;

export const Main = styled.main`
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 66px 0 48px;

  @media (max-width: 720px) {
    width: min(100% - 28px, 1200px);
    padding-top: 38px;
  }
`;

export const SearchSection = styled.section`
  text-align: center;
  margin-bottom: 34px;
`;

export const SectionCategory = styled.span`
  display: block;
  margin-bottom: 4px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
`;

export const SectionTitle = styled.h1`
  margin: 0 0 28px;
  color: #063e66;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 500;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const SearchInputWrapper = styled.div`
  width: min(100%, 360px);
  height: 50px;
  padding: 4px;
  display: flex;
  align-items: center;
  border: 1.5px solid #8da0b8;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

export const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  height: 100%;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #2c3547;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #aeb9c7;
  }
`;

export const ClearButton = styled.button`
  width: 112px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: #aeb9c7;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;

  &:hover {
    background: #95a3b5;
  }
`;

export const TableSection = styled.section`
  width: min(100%, 930px);
  margin: 0 auto;
`;

export const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 24px;
  margin-bottom: 8px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, max-content);
  }
`;

export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-size: 12px;
  font-weight: 500;
`;

export const Dot = styled.span<{ $status: string; $large?: boolean }>`
  width: ${({ $large }) => ($large ? '16px' : '13px')};
  height: ${({ $large }) => ($large ? '16px' : '13px')};
  display: inline-block;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.38);
  background: ${({ $status }) => getStatusColor($status)};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`;

export const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  text-align: left;

  thead {
    background: #2f3b4f;
    color: #fff;
  }

  th,
  td {
    border: 1px solid #fff;
  }

  th {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
  }

  td {
    padding: 8px 12px;
    background: #4b586d;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }

  tbody tr:hover td {
    background: #56647a;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;

  &:hover {
    color: #ff8424;
  }
`;

export const Pagination = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.82);
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) => ($active ? '#64748b' : '#334155')};
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;

  &:hover {
    background: #fb7900;
  }
`;
