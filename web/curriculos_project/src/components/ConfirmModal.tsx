import type { ReactNode } from 'react';
import styled from 'styled-components';
import { BottomSheet } from './BottomSheet';

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

const ConfirmBody = styled.div<{ $tone: 'danger' | 'default' }>`
  padding: 20px 28px 28px;

  @media (max-width: 767px) {
    padding: 16px 22px calc(22px + env(safe-area-inset-bottom));
  }
`;

const ConfirmIcon = styled.span<{ $tone: 'danger' | 'default' }>`
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
`;

const Description = styled.div`
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
`;

const Actions = styled.div`
  padding-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 767px) {
    padding-top: 18px;
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ $tone?: 'danger' | 'default'; $primary?: boolean }>`
  min-width: 112px;
  min-height: 44px;
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

  &:focus-visible {
    outline: 3px solid rgba(255, 132, 36, 0.35);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 767px) {
    width: 100%;
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
  return (
    <BottomSheet isOpen title={title} onClose={onCancel}>
      <ConfirmBody $tone={tone}>
        <ConfirmIcon $tone={tone} aria-hidden="true">
          {tone === 'danger' ? '!' : '✓'}
        </ConfirmIcon>
        <Description>{description}</Description>
        <Actions>
          <Button type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" $primary $tone={tone} onClick={onConfirm} disabled={loading}>
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </Actions>
      </ConfirmBody>
    </BottomSheet>
  );
}
