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
    color: #063e66;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 500;
  }

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchInput = styled.input`
  width: min(100%, 340px);
  height: 42px;
  padding: 0 18px;
  border: 1.5px solid #8da0b8;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #2c3547;
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
  margin-top: 8px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
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
