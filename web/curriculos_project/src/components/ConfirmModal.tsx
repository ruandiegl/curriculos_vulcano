import { useRef } from 'react';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import styled from 'styled-components';

type ConfirmModalProps = {
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  tone?: 'danger' | 'default';
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const MOBILE_DRAWER_QUERY = '(max-width: 640px)';
const DRAWER_CLOSE_DISTANCE = 90;

function isMobileDrawer() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_DRAWER_QUERY).matches;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.66);

  @media (max-width: 640px) {
    align-items: end;
    padding: 0;
    overflow: hidden;
  }
`;

const Modal = styled.div`
  width: min(440px, 100%);
  max-height: min(720px, calc(100vh - 48px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 22px 64px rgba(15, 23, 42, 0.32);
  overflow-y: auto;
  touch-action: pan-y;

  @media (max-width: 640px) {
    width: 100%;
    max-height: min(86dvh, 620px);
    border-radius: 18px 18px 0 0;
    padding-top: 14px;
    box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.28);
  }
`;

const DrawerHandle = styled.div`
  display: none;

  @media (max-width: 640px) {
    width: 42px;
    height: 4px;
    margin: 0 auto 2px;
    border-radius: 999px;
    background: #cbd5e1;
    display: block;
    cursor: grab;
  }
`;

const Header = styled.div<{ $tone: 'danger' | 'default' }>`
  padding: 26px 28px 16px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 640px) {
    padding: 18px 22px 14px;
  }

  span {
    width: 42px;
    height: 42px;
    margin-bottom: 16px;
    border-radius: 50%;
    display: inline-grid;
    place-items: center;
    background: ${({ $tone }) => ($tone === 'danger' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(251, 121, 0, 0.14)')};
    color: ${({ $tone }) => ($tone === 'danger' ? '#dc2626' : '#fb7900')};
    font-size: 24px;
    font-weight: 900;
  }

  h2 {
    margin: 0;
    color: #063e66;
    font-size: 22px;
    line-height: 1.2;
    font-weight: 800;
  }
`;

const Body = styled.div`
  padding: 18px 28px 6px;

  @media (max-width: 640px) {
    padding: 16px 22px 4px;
  }

  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.55;
  }
`;

const Description = styled.div`
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
`;

const Actions = styled.div`
  padding: 22px 28px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 640px) {
    padding: 18px 22px calc(22px + env(safe-area-inset-bottom));
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ $tone?: 'danger' | 'default'; $primary?: boolean }>`
  min-height: 42px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: ${({ $tone, $primary }) => {
    if (!$primary) return '#e2e8f0';
    return $tone === 'danger' ? '#dc2626' : '#ff8424';
  }};
  color: ${({ $primary }) => ($primary ? '#fff' : '#334155')};
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: ${({ $tone, $primary }) => {
      if (!$primary) return '#cbd5e1';
      return $tone === 'danger' ? '#b91c1c' : '#fb7900';
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  loadingLabel = 'Excluindo...',
  tone = 'danger',
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const dragStartYRef = useRef<number | null>(null);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }

  function handleDrawerPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!isMobileDrawer()) {
      return;
    }

    dragStartYRef.current = event.clientY;
  }

  function handleDrawerPointerUp(event: PointerEvent<HTMLDivElement>) {
    const startY = dragStartYRef.current;
    dragStartYRef.current = null;

    if (!isMobileDrawer() || startY === null) {
      return;
    }

    if (event.clientY - startY >= DRAWER_CLOSE_DISTANCE) {
      onCancel();
    }
  }

  return (
    <Backdrop role="presentation" onClick={handleBackdropClick}>
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onPointerDown={handleDrawerPointerDown}
        onPointerUp={handleDrawerPointerUp}
        onPointerCancel={() => {
          dragStartYRef.current = null;
        }}
      >
        <DrawerHandle aria-hidden="true" />
        <Header $tone={tone}>
          <span aria-hidden="true">{tone === 'danger' ? '!' : '✓'}</span>
          <h2 id="confirm-modal-title">{title}</h2>
        </Header>
        <Body>
          <Description>{description}</Description>
        </Body>
        <Actions>
          <Button type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" $primary $tone={tone} onClick={onConfirm} disabled={loading}>
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </Actions>
      </Modal>
    </Backdrop>
  );
}
