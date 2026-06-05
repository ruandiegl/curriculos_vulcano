import styled from 'styled-components';
import { Form } from '../ForgotPassword/styles';

export const RecoveryForm = styled(Form)`
  justify-content: flex-start;
  overflow-y: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;

  > * {
    flex-shrink: 0;
  }
`;
