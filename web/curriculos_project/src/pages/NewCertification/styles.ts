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
  display: none;
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
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 0 0 48px;
  flex: 1;
`;

export const Section = styled.section`
  background: #fff;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const SectionTitle = styled.h2`
  color: #102a43;
  font-size: 22px;
  font-weight: 900;
  margin: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #64748b;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  input, textarea {
    width: 100%;
    background: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    color: #223044;
    padding: 0 12px;
    min-height: 42px;
    font-size: 14px;
    font-weight: 700;
    outline: none;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      border-color: #ff8424;
      box-shadow: 0 0 0 3px rgba(255, 132, 36, 0.16);
    }
  }

  textarea {
    resize: vertical;
    min-height: 92px;
    padding-top: 12px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
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
`;

export const BackButton = styled.button`
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: #e2e8f0;
  color: #334155;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: #cbd5e1;
  }
`;

export const Footer = styled.footer`
  display: none;
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
