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
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 60px 0 80px;
  flex: 1;
`;

export const Section = styled.section`
  background: #778899; /* Dark blue-greyish color from image */
  padding: 40px;
  margin-bottom: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const SectionTitle = styled.h2`
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 30px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldsetTitle = styled.h3`
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  margin: 28px 0 20px;
  text-transform: uppercase;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  height: 34px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #fff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  padding: 0 2px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 34px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #fff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;

  option {
    background: #778899;
    color: #fff;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SubmitButton = styled.button`
  height: 44px;
  padding: 0 40px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #063e66;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;

  &:hover {
    background: #f1f5f9;
  }
`;

export const ReturnButton = styled.button`
  height: 44px;
  padding: 0 40px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #063e66;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;

  &:hover {
    background: #f1f5f9;
  }
`;

export const Footer = styled.footer`
  background: #fff;
  padding: 40px 0;
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
    gap: 20px;
    text-align: center;
  }
`;

export const Copyright = styled.span`
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
`;
