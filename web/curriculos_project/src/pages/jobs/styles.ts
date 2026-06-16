export {
  ActionLink,
  Brand,
  Card,
  CardDescription,
  CardTitle,
  Copyright,
  Footer,
  FooterContent,
  Header,
  HeaderContent,
  HeaderNav,
  InfoText,
  LogoutButton,
  NavLink,
  Page,
  UserInfo,
} from '../Profile/styles';

import styled from 'styled-components';
import { Main as ProfileMain } from '../Profile/styles';

export const Main = styled(ProfileMain)`
  width: min(930px, calc(100% - 48px));
`;

export const SearchBar = styled.div`
  padding: 22px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;

  span {
    display: block;
    margin-bottom: 4px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
  }

  h1 {
    margin: 0;
    color: #102a43;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 900;
  }

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchInput = styled.input`
  width: min(100%, 340px);
  height: 42px;
  padding: 0 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #223044;
  font-size: 13px;
  font-weight: 700;
  outline: none;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

  &::placeholder {
    color: #aeb9c7;
  }

  &:focus {
    border-color: #ff8424;
    box-shadow: 0 0 0 4px rgba(255, 132, 36, 0.14);
  }

  @media (max-width: 680px) {
    width: 100%;
  }
`;

export const StatusBadge = styled.span`
  width: fit-content;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #edf5ff;
  color: #063e66;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const SubmitButton = styled.button`
  width: fit-content;
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

export const JobActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;

  @media (max-width: 460px) {
    align-items: stretch;
    flex-direction: column;

    ${SubmitButton} {
      width: 100%;
    }
  }
`;

export const DangerButton = styled(SubmitButton)`
  background: #f1f5f9;
  color: #dc2626;

  &:hover {
    background: #e2e8f0;
  }
`;

export const ConfirmationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ConfirmationIntro = styled.p`
  margin: 0;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
`;

export const ConfirmationSummary = styled.div`
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  display: grid;
  gap: 10px;
`;

export const ConfirmationItem = styled.div`
  display: grid;
  gap: 4px;

  span {
    color: #64748b;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong,
  p {
    margin: 0;
    color: #102a43;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  p {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
