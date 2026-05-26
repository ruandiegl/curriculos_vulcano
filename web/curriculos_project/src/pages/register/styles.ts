import styled from 'styled-components';
import solda from '../../assets/solda.jpg';

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px 0;
  display: grid;
  place-items: start center;
  background:
    linear-gradient(
      90deg,
      rgba(251, 121, 0, 0.08) 0%,
      rgba(251, 121, 0, 0.04) 30%,
      rgba(251, 121, 0, 0.2) 45%,
      rgba(251, 121, 0, 0.52) 58%,
      rgba(251, 121, 0, 0.82) 72%,
      #fb7900 92%,
      #fb7900 100%
    ),
    url(${solda}) center center / cover no-repeat,
    #fb7900;
  color: #2c3547;
  font-family: Inter, "Segoe UI", Arial, sans-serif;

  @media (max-width: 1200px) {
    padding: 24px;
  }

  @media (max-width: 820px) {
    padding: 18px;
  }
`;

export const Card = styled.section`
  width: 90%;
  min-height: 666px;
  height: min(90vh, 760px);
  display: grid;
  grid-template-columns: 530px minmax(0, 1fr);
  overflow: hidden;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 1px px rgba(22, 27, 34, 0.1);

  @media (max-width: 1200px) {
    width: min(100%, 960px);
    min-height: 642px;
    grid-template-columns: minmax(380px, 44%) minmax(0, 1fr);
  }

  @media (max-width: 820px) {
    width: min(100%, 560px);
    min-height: auto;
    height: auto;
    grid-template-columns: 1fr;
  }
`;

export const Form = styled.form`
  min-width: 0;
  width: 100%;
  height: 100%;
  padding: 40px 104px 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    margin: 0 0 14px;
  }

  @media (max-width: 1200px) {
    padding-inline: 64px;
  }

  @media (max-width: 820px) {
    padding: 42px 28px 48px;
  }
`;

export const Brand = styled.div`
  width: 251px;
  height: 80px;
  margin-bottom: 34px;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }

  @media (max-width: 820px) {
    margin-bottom: 48px;
  }
`;

export const Field = styled.label`
  width: 100%;
  margin-bottom: 20px;

  span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  input {
    width: 100%;
    height: 54px;
    padding: 0 31px;
    border: 1px solid #edf1f5;
    border-radius: 8px;
    outline: none;
    color: #344054;
    background: #f5f8fb;
    box-shadow: inset 0 0 0 1px rgba(231, 236, 242, 0.3);
    font-size: 14px;
    font-weight: 700;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  input::placeholder {
    color: #a9b6c4;
    opacity: 1;
  }

  input:focus {
    border-color: #ffb270;
    box-shadow: 0 0 0 4px rgba(255, 132, 36, 0.14);
  }
`;

export const RegisterButton = styled.button`
  width: 100%;
  min-height: 56px;
  height: 56px;
  margin-top: 0;
  border: 0;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: #fff;
  background: #ff8424;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(95, 45, 5, 0.08);

  &:hover {
    background: #ff7b17;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }
`;

export const ConsentBox = styled.div`
  width: 100%;
  margin: -2px 0 18px;
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  color: #58677a;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;

  input {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    accent-color: #ff8424;
  }

  button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #063e66;
    cursor: pointer;
    font: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.68);
`;

export const PolicyModal = styled.div`
  width: min(760px, 100%);
  max-height: min(82vh, 760px);
  border-radius: 8px;
  background: #f7fafc;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.32);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const PolicyHeader = styled.div`
  padding: 24px 28px 18px;
  border-bottom: 1px solid #dbe4ee;

  h2 {
    margin: 0;
    color: #172033;
    font-size: 20px;
    font-weight: 900;
  }

  span {
    display: block;
    margin-top: 6px;
    color: #6b7a90;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const PolicyContent = styled.div`
  padding: 24px 28px;
  overflow: auto;
  color: #111827;

  section + section {
    margin-top: 26px;
  }

  h3 {
    margin: 0 0 12px;
    color: #111827;
    font-size: 14px;
    font-weight: 900;
    text-align: center;
    text-transform: uppercase;
    text-decoration: underline;
  }

  p {
    margin: 0 0 12px;
    color: #111827;
    display: block;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.6;
  }
`;

export const PolicyActions = styled.div`
  padding: 18px 28px 24px;
  border-top: 1px solid #dbe4ee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

export const PolicyButton = styled.button<{ $secondary?: boolean }>`
  min-height: 44px;
  padding: 0 24px;
  border: 0;
  border-radius: 7px;
  background: ${({ $secondary }) => ($secondary ? '#e8eef5' : '#ff8424')};
  color: ${({ $secondary }) => ($secondary ? '#263346' : '#fff')};
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: ${({ $secondary }) => ($secondary ? '#dce6f0' : '#ff7b17')};
  }
`;

export const FormMessage = styled.p<{ $success?: boolean }>`
  width: 100%;
  margin: 0 0 14px;
  display: block;
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
  width: 100%;
  min-height: 56px;
  height: 56px;
  margin-top: 6px;
  border: 0;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: #fff;
  background: #ff8424;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(95, 45, 5, 0.08);

  &:hover {
    background: #ff7b17;
  }
`;

export const LoginIcon = styled.span`
  position: relative;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;

  .head {
    position: absolute;
    top: 2px;
    left: 3px;
    width: 8px;
    height: 8px;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  .body {
    position: absolute;
    left: 0;
    bottom: 1px;
    width: 16px;
    height: 10px;
    border: 2px solid #fff;
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
  }

  .plus {
    position: absolute;
    background: #fff;
    border-radius: 1px;
  }

  .horizontal {
    top: 7px;
    right: 0;
    width: 9px;
    height: 2px;
  }

  .vertical {
    top: 3px;
    right: 3px;
    width: 2px;
    height: 9px;
  }
`;

export const ForgotLink = styled.a`
  margin-top: 36px;
  color: #8691a8;
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

export const SignupText = styled.p`
  margin: 36px 0 0;
  color: #8d98aa;
  font-size: 14px;
  font-weight: 700;

  a {
    color: #818ca1;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const PhotoPanel = styled.div`
  min-width: 0;
  height: 100%;
  background: url(${solda}) center center / cover no-repeat #142330;
  position: relative;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 820px) {
    min-height: 260px;
    height: 260px;
    order: -1;
  }
`;
