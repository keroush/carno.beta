"use client";

import { useCallback, useRef, useState, type DragEvent as ReactDragEvent, type PointerEvent as ReactPointerEvent } from "react";

interface UseFreeDragCarouselArgs {
  /** 100 / slidesPerView — the width of one slide as a percentage of the full track width. */
  slideWidthPercent: number;
  /** Furthest slide index the track is allowed to scroll to. */
  maxSlideIndex: number;
}

export function useFreeDragCarousel({ slideWidthPercent, maxSlideIndex }: UseFreeDragCarouselArgs) {
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startOffset: number;
    trackWidth: number;
    captured: boolean;
  } | null>(null);

  const DRAG_THRESHOLD_PX = 6;

  const maxOffsetPercent = Math.max(0, maxSlideIndex * slideWidthPercent);

  const clamp = useCallback((value: number) => Math.min(maxOffsetPercent, Math.max(0, value)), [maxOffsetPercent]);

  const activeIndex =
    slideWidthPercent > 0 ? Math.min(maxSlideIndex, Math.max(0, Math.round(offsetPercent / slideWidthPercent))) : 0;

  const goToIndex = useCallback((index: number) => setOffsetPercent(clamp(index * slideWidthPercent)), [clamp, slideWidthPercent]);

  const stepBy = useCallback((delta: number) => goToIndex(activeIndex + delta), [activeIndex, goToIndex]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetPercent,
      trackWidth: event.currentTarget.getBoundingClientRect().width || 1,
      captured: false,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaPx = event.clientX - drag.startX;

    if (!drag.captured) {
      if (Math.abs(deltaPx) < DRAG_THRESHOLD_PX) return;
      drag.captured = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(drag.pointerId);
    }

    event.preventDefault();
    // Dragging the pointer toward the start of reading order (right, in RTL)
    // reveals earlier slides; dragging toward the end (left) advances forward.
    const deltaPercent = (deltaPx / drag.trackWidth) * 100;
    setOffsetPercent(clamp(drag.startOffset + deltaPercent));
  }

  function endDrag() {
    const wasCaptured = dragRef.current?.captured ?? false;
    dragRef.current = null;
    setIsDragging(false);
    // Free dragging, but always settle on a full card rather than stopping
    // mid-way between two — snap to whichever slide is nearest.
    if (wasCaptured) goToIndex(activeIndex);
  }

  function preventNativeDrag(event: ReactDragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return {
    offsetPercent,
    isDragging,
    activeIndex,
    goToIndex,
    stepBy,
    canGoPrev: offsetPercent > 0.01,
    canGoNext: offsetPercent < maxOffsetPercent - 0.01,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
      onDragStart: preventNativeDrag,
      className: "cursor-grab select-none active:cursor-grabbing",
      style: { touchAction: "pan-y" } as const,
    },
  };
}
