import { useCallback, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import { useMediaQuery } from './useMediaQuery';

const MOBILE_QUERY = '(max-width: 767px)';
const CLOSE_DISTANCE = 80;

type BottomSheetHandlers = {
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: () => void;
};

type UseBottomSheetResult = {
  sheetRef: RefObject<HTMLDivElement | null>;
  handleRef: RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  dragOffset: number;
} & BottomSheetHandlers;

export function useBottomSheet(onClose: () => void): UseBottomSheetResult {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isMobile) {
        return;
      }

      startYRef.current = event.clientY;
      setIsDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [isMobile],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const startY = startYRef.current;

      if (!isMobile || startY === null) {
        return;
      }

      setDragOffset(Math.max(0, event.clientY - startY));
    },
    [isMobile],
  );

  const resetDrag = useCallback(() => {
    startYRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const startY = startYRef.current;

      if (!isMobile || startY === null) {
        resetDrag();
        return;
      }

      const distance = event.clientY - startY;
      resetDrag();

      if (distance >= CLOSE_DISTANCE) {
        onClose();
      }
    },
    [isMobile, onClose, resetDrag],
  );

  return {
    sheetRef,
    handleRef,
    isDragging,
    dragOffset,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: resetDrag,
  };
}
