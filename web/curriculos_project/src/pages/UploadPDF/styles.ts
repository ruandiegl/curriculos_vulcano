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

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const Greeting = styled.div`
  margin-bottom: 20px;
  padding: 22px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  
  p {
    color: #102a43;
    font-size: 16px;
    font-weight: 800;
    margin: 0;
  }

  @media (max-width: 640px) {
    padding: 18px;
  }
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

  @media (max-width: 640px) {
    padding: 18px;
    gap: 22px;
  }
`;

export const SectionTitle = styled.h2`
  color: #102a43;
  font-size: 22px;
  font-weight: 900;
  margin: 0;
`;

export const FileInputContainer = styled.div`
  padding: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  width: 100%;
  max-width: 600px;

  input[type="file"] {
    width: 100%;
    max-width: 100%;
    color: #223044;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    
    &::file-selector-button {
      border: 1px solid #ccc;
      padding: 8px 12px;
      border-radius: 8px;
      background-color: #ff8424;
      color: #fff;
      cursor: pointer;
      margin-right: 12px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  @media (max-width: 640px) {
    padding: 14px;

    input[type="file"] {
      font-size: 12px;
    }

    input[type="file"]::file-selector-button {
      display: block;
      width: 100%;
      margin: 0 0 8px;
    }
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FileListEmpty = styled.div`
  padding: 18px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
`;

export const FileListItem = styled.div`
  min-height: 70px;
  padding: 16px 18px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const FileListName = styled.div`
  color: #102a43;
  font-size: 15px;
  font-weight: 800;
  overflow-wrap: anywhere;
`;

export const FileListMeta = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
`;

export const FileListActions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

export const FileListButton = styled.button<{ $danger?: boolean }>`
  min-height: 36px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: ${({ $danger }) => ($danger ? '#dc2626' : '#e2e8f0')};
  color: ${({ $danger }) => ($danger ? '#fff' : '#334155')};
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? '#b91c1c' : '#cbd5e1')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const BaseActionButton = styled.button`
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const SubmitButton = styled(BaseActionButton)`
  background: #ff8424;
  color: #fff;

  &:hover:not(:disabled) {
    background: #fb7900;
  }
`;

export const BackButton = styled(BaseActionButton)`
  background: #e2e8f0;
  color: #334155;

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
