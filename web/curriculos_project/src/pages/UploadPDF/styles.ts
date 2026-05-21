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
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 60px 0 80px;
  flex: 1;
`;

export const Greeting = styled.div`
  margin-bottom: 40px;

  p {
    color: #063e66;
    font-size: 18px;
    font-weight: 500;
    margin: 4px 0;
  }
`;

export const Section = styled.section`
  background: #778899; /* Dark blue-grey from image */
  padding: 50px;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
`;

export const FileInputContainer = styled.div`
  border-bottom: 1.5px solid #fff;
  padding-bottom: 8px;
  width: 100%;
  max-width: 600px;

  input[type="file"] {
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &::file-selector-button {
      border: 1px solid #ccc;
      padding: 4px 12px;
      border-radius: 4px;
      background-color: #fff;
      color: #333;
      cursor: pointer;
      margin-right: 12px;
      font-size: 13px;
      font-weight: 500;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  margin-top: 10px;
`;

export const BackButton = styled.button`
  height: 40px;
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
