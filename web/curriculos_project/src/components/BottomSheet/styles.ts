import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.66);
  animation: bottom-sheet-backdrop-in 180ms ease-out both;

  @keyframes bottom-sheet-backdrop-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    align-items: flex-end;
    padding: 0;
    overflow: hidden;
  }
`;

export const Sheet = styled.div<{ $dragOffset: number; $isDragging: boolean; $wide: boolean }>`
  width: ${({ $wide }) => ($wide ? 'min(620px, 100%)' : 'min(560px, 100%)')};
  max-height: min(760px, calc(100vh - 48px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 22px 64px rgba(15, 23, 42, 0.32);
  overflow: hidden;
  transform: translateY(${({ $dragOffset }) => `${$dragOffset}px`});
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)')};
  animation: bottom-sheet-sheet-in 300ms cubic-bezier(0.32, 0.72, 0, 1) both;

  @keyframes bottom-sheet-sheet-in {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 767px) {
    width: 100%;
    max-height: min(88dvh, 760px);
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.28);
    animation-name: bottom-sheet-mobile-in;
  }

  @keyframes bottom-sheet-mobile-in {
    from {
      opacity: 1;
      transform: translateY(100%);
    }

    to {
      opacity: 1;
      transform: translateY(${({ $dragOffset }) => `${$dragOffset}px`});
    }
  }
`;

export const Handle = styled.div`
  display: none;

  @media (max-width: 767px) {
    width: 44px;
    height: 5px;
    margin: 12px auto 4px;
    border-radius: 999px;
    background: #cbd5e1;
    display: block;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }
`;

export const Header = styled.header`
  padding: 22px 26px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0;
    color: #102a43;
    font-size: 20px;
    line-height: 1.2;
    font-weight: 900;
  }

  @media (max-width: 767px) {
    padding: 16px 22px 14px;
  }
`;

export const Content = styled.div`
  max-height: min(600px, calc(100vh - 160px));
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 767px) {
    max-height: calc(88dvh - 88px);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;
