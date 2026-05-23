import styled from 'styled-components';
import {
  Brand,
  Card,
  Field,
  Form,
  LoginButton,
  LoginIcon,
  Page,
  PhotoPanel,
} from '../Login/styles';

export { Brand, Card, Field, Form, LoginButton, LoginIcon, Page, PhotoPanel };

export const Description = styled.p`
  width: 100%;
  margin: -18px 0 28px;
  color: #697586;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
`;

export const FormMessage = styled.p<{ $success?: boolean }>`
  width: 100%;
  margin: -12px 0 18px;
  color: ${({ $success }) => ($success ? '#2f8f75' : '#dc2626')};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
`;

export const ReturnButton = styled.button`
  margin-top: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #818ca1;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
`;
