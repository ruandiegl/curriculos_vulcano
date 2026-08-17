import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useBottomSheet } from '../../hooks/useBottomSheet';
import { Backdrop, Content, Handle, Header, Sheet } from './styles';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  wide?: boolean;
  children: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BottomSheet({ isOpen, onClose, title, ariaLabel, wide = false, children }: BottomSheetProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const { sheetRef, handleRef, isDragging, dragOffset, ...dragHandlers } = useBottomSheet(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    const sheet = sheetRef.current;

    document.body.style.overflow = 'hidden';

    const focusableElements = sheet ? Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    (focusableElements[0] ?? sheet)?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !sheet) {
        return;
      }

      const elements = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

      if (elements.length === 0) {
        event.preventDefault();
        sheet.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousActiveElement?.focus?.();
    };
  }, [isOpen, sheetRef]);

  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSheetKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }

  return (
    <Backdrop role="presentation" onMouseDown={handleBackdropClick}>
      <Sheet
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel ?? 'Janela de diálogo'}
        tabIndex={-1}
        $dragOffset={dragOffset}
        $isDragging={isDragging}
        $wide={wide}
        onKeyDown={handleSheetKeyDown}
      >
        <Handle
          ref={handleRef}
          aria-hidden="true"
          onPointerDown={dragHandlers.handlePointerDown}
          onPointerMove={dragHandlers.handlePointerMove}
          onPointerUp={dragHandlers.handlePointerUp}
          onPointerCancel={dragHandlers.handlePointerCancel}
        />
        {title && (
          <Header>
            <h2 id={titleId}>{title}</h2>
          </Header>
        )}
        <Content>{children}</Content>
      </Sheet>
    </Backdrop>
  );
}
