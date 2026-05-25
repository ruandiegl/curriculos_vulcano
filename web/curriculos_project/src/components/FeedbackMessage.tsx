import type { ReactNode } from 'react';
import styled from 'styled-components';

type FeedbackVariant = 'error' | 'success' | 'info';

type FeedbackMessageProps = {
  children: ReactNode;
  variant?: FeedbackVariant;
};

const colors = {
  error: {
    background: '#fecdd3',
    border: '#fecdd3',
    stripe: '#dc2626',
    text: '#991b1b',
  },
  success: {
    background: '#ecfdf5',
    border: '#bbf7d0',
    stripe: '#16a34a',
    text: '#166534',
  },
  info: {
    background: '#eff6ff',
    border: '#bfdbfe',
    stripe: '#2563eb',
    text: '#1e3a8a',
  },
};

const MessageBox = styled.div<{ $variant: FeedbackVariant }>`
  width: 100%;
  margin: 0 0 24px;
  padding: 14px 18px;
  border: 1px solid ${({ $variant }) => colors[$variant].border};
  border-left: 5px solid ${({ $variant }) => colors[$variant].stripe};
  border-radius: 7px;
  background: ${({ $variant }) => colors[$variant].background};
  color: ${({ $variant }) => colors[$variant].text};
  font-size: 14px;
  font-weight: 800;
  line-height: 1.45;
`;

export function FeedbackMessage({ children, variant = 'error' }: FeedbackMessageProps) {
  return (
    <MessageBox $variant={variant} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
    </MessageBox>
  );
}
