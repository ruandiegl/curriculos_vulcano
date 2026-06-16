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
  padding: 32px 0 64px;
  flex: 1;
`;

export const BackLink = styled.a`
  display: none; /* Removed as per the image layout which uses buttons at the bottom */
`;

export const Section = styled.section`
  background: #fff;
  padding: 24px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
`;

export const SectionTitle = styled.h2`
  color: #102a43;
  font-size: 20px;
  font-weight: 900;
  margin: 0 0 24px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const Label = styled.span`
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const Value = styled.span`
  width: 100%;
  min-height: 42px;
  padding: 11px 12px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #f8fafc;
  color: #102a43;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: flex-start;
  line-height: 1.35;
  overflow-wrap: anywhere;
  white-space: normal;
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

export const ActionButton = styled.a`
  min-height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  border: 0;
  background: #ff8424;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #fb7900;
  }
`;

export const StatusWrapper = styled.div`
  padding: 18px 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 18px;
`;

export const StatusLabel = styled.div`
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
`;

export const StatusSelect = styled.select`
  min-width: 180px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #2c3547;
  font-size: 13px;
  font-weight: 800;
  outline: none;
  background: #fff;
`;

export const DownloadLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const DownloadLink = styled.a`
  width: fit-content;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #f8fafc;
  color: #102a43;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    border-color: #ff8424;
    color: #fb7900;
  }
`;

export const Footer = styled.footer`
  display: none;
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
