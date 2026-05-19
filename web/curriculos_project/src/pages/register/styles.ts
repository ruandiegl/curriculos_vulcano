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
  padding: 58px 104px 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  position: relative;
  z-index: 1;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    margin-bottom: 8px;

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
  margin-bottom: 66px;
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
  margin-bottom: 31px;

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
  height: 56px;
  margin-top: -6px;
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

export const ReturnButton = styled.button`
  width: 100%;
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
