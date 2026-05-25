import styled from 'styled-components';
import solda from '../../assets/solda.jpg';

export const Page = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(239, 245, 250, 0.96), rgba(248, 250, 252, 0.98)),
    url(${solda}) center top / cover fixed;
  color: #2c3547;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  display: flex;
  flex-direction: column;
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

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

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

export const NavLink = styled.div`
  color: #063e66;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

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
  padding: 66px 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SectionTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 34px;

  span {
    display: block;
    margin-bottom: 4px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }

  h1 {
    margin: 0;
    color: #063e66;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 500;
  }
`;

export const TableSection = styled.section`
  width: min(100%, 930px);
  margin-bottom: 40px;
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

export const OpenFormButton = styled.button`
  height: 40px;
  padding: 0 30px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #063e66;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;

  &:hover {
    background: #f1f5f9;
  }
`;

export const FormSection = styled.section`
  width: min(100%, 800px);
  background: #434e61; /* Adjusted navy blue/grey from image */
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 36px 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'auto')};
`;

export const Label = styled.label`
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
`;

export const Input = styled.input`
  width: 100%;
  height: 36px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #fff;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  padding: 0 2px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #fff;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  padding: 8px 2px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const FormActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 50px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const SubmitButton = styled.button`
  height: 45px;
  padding: 0 40px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #063e66;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;

  &:hover {
    background: #f1f5f9;
  }
`;

export const CloseButton = styled.button`
  height: 45px;
  padding: 0 40px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #063e66;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;

  &:hover {
    background: #f1f5f9;
  }
`;

export const Footer = styled.footer`
  background: #fff;
  padding: 60px 0;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
`;

export const FooterContent = styled.div`
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 720px) {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
`;

export const Copyright = styled.span`
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
`;