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
  padding: 12px 14px;
  border: 1px solid ${({ $success }) => ($success ? '#bbf7d0' : '#fecdd3')};
  border-left: 5px solid ${({ $success }) => ($success ? '#16a34a' : '#dc2626')};
  border-radius: 7px;
  background: ${({ $success }) => ($success ? '#ecfdf5' : '#fff1f2')};
  color: ${({ $success }) => ($success ? '#166534' : '#991b1b')};
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
  text-align: left;
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
