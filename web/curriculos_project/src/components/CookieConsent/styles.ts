import styled from 'styled-components';

export const CookieBanner = styled.aside`
  position: fixed;
  right: 24px;
  bottom: 24px;
  left: 24px;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(920px, calc(100% - 48px));
  margin: 0 auto;
  padding: 20px 24px;
  border: 1px solid rgba(48, 56, 74, 0.12);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(27, 35, 51, 0.2);
  color: #30384a;
  font-family: Inter, "Segoe UI", Arial, sans-serif;

  @media (max-width: 640px) {
    right: 12px;
    bottom: 12px;
    left: 12px;
    width: calc(100% - 24px);
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
  }
`;

export const CookieContent = styled.div`
  min-width: 0;
`;

export const CookieTitle = styled.h2`
  margin: 0 0 6px;
  color: #30384a;
  font-size: 17px;
  line-height: 1.3;
`;

export const CookieText = styled.p`
  margin: 0;
  color: #596579;
  font-size: 14px;
  line-height: 1.5;
`;

export const CookieActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 10px;
  align-items: center;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const CookieButton = styled.button<{ $secondary?: boolean }>`
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid ${({ $secondary }) => ($secondary ? '#d5dbe5' : '#fb7900')};
  border-radius: 8px;
  background: ${({ $secondary }) => ($secondary ? '#ffffff' : '#fb7900')};
  color: ${({ $secondary }) => ($secondary ? '#4b586d' : '#ffffff')};
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ $secondary }) => ($secondary ? '#aeb8c7' : '#d86200')};
    background: ${({ $secondary }) => ($secondary ? '#f7f9fb' : '#d86200')};
  }

  &:focus-visible {
    outline: 3px solid rgba(251, 121, 0, 0.35);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 640px) {
    flex: 1;
    padding-inline: 12px;
  }
`;
