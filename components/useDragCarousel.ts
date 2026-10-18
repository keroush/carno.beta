"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Movement before a press becomes a drag — keeps taps on cards/buttons working. */
const DRAG_THRESHOLD_PX = 6;
/** Fraction of the pull that shows past the first/last slide (rubber band). */
const RUBBER_BAND = 0.35;
/** A release faster than this (px/ms) over a real distance counts as a flick. */
const FLICK_SPEED = 0.35;
const FLICK_MIN_DISTANCE_PX = 24;
/** How far ahead of the finger the release velocity is projected. */
const INERTIA_MS = 240;
const SETTLE_MS = 520;
const SETTLE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Horizontal trackpad swipe: accumulated deltaX needed for one step, and the silence that ends a gesture. */
const WHEEL_STEP_PX = 30;
const WHEEL_IDLE_MS = 160;
const EPS = 0.01;

interface Sample {
  t: number;
  x: number;
}

function nearestIndex(points: number[], value: number): number {
  let best = 0;
  let bestDistance = Infinity;
  points.forEach((point, index) => {
    const distance = Math.abs(point - value);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

/** Snap point at `index`, clamped to the valid range. */
function pointAt(points: number[], index: number): number {
  return points[Math.max(0, Math.min(points.length - 1, index))] ?? 0;
}

function lastPoint(points: number[]): number {
  return points[points.length - 1] ?? 0;
}

/**
 * Drag / swipe / trackpad carousel for an RTL flex track whose slides are its direct
 * children. Positive translateX reveals later slides (they sit further left).
 *
 * Why it is built this way:
 * - Slide width comes from CSS only. The hook *measures* it (ResizeObserver), so there
 *   is no JS breakpoint table to keep in sync with the styles and no wrong-width flash
 *   before hydration.
 * - While dragging, the transform is written straight to the DOM in an animation frame —
 *   React state is not touched per pointermove, so the cards (and their images) don't
 *   re-render 60 times a second. State changes only when a drag starts and when it settles.
 * - Release snaps to the slide the finger was heading for (velocity projected ahead), the
 *   ends rubber-band, and a settle animation can be grabbed mid-flight.
 * - Horizontal trackpad swipes (wheel events with deltaX) step the carousel, so laptop
 *   users can "swipe" too, not only drag with a mouse.
 */
export function useDragCarousel({ slideCount }: { slideCount: number }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [metrics, setMetrics] = useState({ slideWidthPercent: 100, slidesPerView: 1 });
  const [position, setPosition] = useState(0); // committed position, in slides — always a snap point
  const [isDragging, setIsDragging] = useState(false);

  const maxPosition = Math.max(0, slideCount - metrics.slidesPerView);
  const snapPoints = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i <= Math.floor(maxPosition + EPS); i++) points.push(i);
    if (maxPosition - Math.floor(maxPosition + EPS) > EPS) points.push(maxPosition);
    return points.length > 0 ? points : [0];
  }, [maxPosition]);

  // Latest values for use inside event handlers without re-binding them.
  const metricsRef = useRef(metrics);
  const snapRef = useRef(snapPoints);
  const positionRef = useRef(0);
  useEffect(() => {
    metricsRef.current = metrics;
    snapRef.current = snapPoints;
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null | undefined;
    if (!track || !first) return;
    const trackWidth = track.clientWidth;
    const slideWidth = first.getBoundingClientRect().width;
    if (trackWidth <= 0 || slideWidth <= 0) return;
    const slidesPerView = trackWidth / slideWidth;
    setMetrics((prev) =>
      Math.abs(prev.slidesPerView - slidesPerView) < 0.001 ? prev : { slideWidthPercent: (slideWidth / trackWidth) * 100, slidesPerView },
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (track.firstElementChild) observer.observe(track.firstElementChild);
    return () => observer.disconnect();
  }, [measure, slideCount]);

  const apply = useCallback((pos: number, animate: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${SETTLE_MS}ms ${SETTLE_EASING}` : "none";
    el.style.transform = `translate3d(${pos * metricsRef.current.slideWidthPercent}%, 0, 0)`;
  }, []);

  // Keep the DOM in step with the committed position. No animation on the first paint or
  // when a resize changed the slide width (that would visibly slide the whole track).
  const mountedRef = useRef(false);
  const lastWidthRef = useRef(metrics.slideWidthPercent);
  useLayoutEffect(() => {
    const resized = lastWidthRef.current !== metrics.slideWidthPercent;
    lastWidthRef.current = metrics.slideWidthPercent;
    apply(position, mountedRef.current && !resized);
    mountedRef.current = true;
  }, [position, metrics.slideWidthPercent, apply]);

  // A breakpoint change can move the last valid position; re-snap.
  useEffect(() => {
    setPosition((prev) => {
      const next = pointAt(snapPoints, nearestIndex(snapPoints, Math.min(prev, maxPosition)));
      positionRef.current = next;
      return next === prev ? prev : next;
    });
  }, [snapPoints, maxPosition]);

  const commit = useCallback(
    (target: number) => {
      positionRef.current = target;
      apply(target, true);
      setPosition(target);
    },
    [apply],
  );

  const goToIndex = useCallback(
    (index: number) => {
      commit(pointAt(snapRef.current, index));
    },
    [commit],
  );

  const stepBy = useCallback(
    (delta: number) => {
      const snaps = snapRef.current;
      goToIndex(nearestIndex(snaps, positionRef.current) + delta);
    },
    [goToIndex],
  );

  // ----- pointer drag (mouse, touch, pen) -----
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startPos: 0,
    active: false,
    samples: [] as Sample[],
    pendingDx: 0,
    raf: 0,
    suppressClick: false,
  });

  /** Position (in slides) for a given horizontal pull, with rubber-banding past the ends. */
  const positionForDrag = useCallback((dxPx: number) => {
    const el = trackRef.current;
    if (!el) return positionRef.current;
    const slideWidthPx = (el.clientWidth * metricsRef.current.slideWidthPercent) / 100;
    const max = lastPoint(snapRef.current);
    const raw = drag.current.startPos + dxPx / slideWidthPx;
    if (raw < 0) return raw * RUBBER_BAND;
    if (raw > max) return max + (raw - max) * RUBBER_BAND;
    return raw;
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (d.pointerId !== -1) return; // second finger — ignore
    const el = trackRef.current;
    if (!el) return;

    // Grab a settle animation mid-flight: freeze where it visibly is and continue from there.
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const visiblePct = el.clientWidth > 0 ? (matrix.m41 / el.clientWidth) * 100 : 0;
    d.startPos = visiblePct / metricsRef.current.slideWidthPercent;
    apply(d.startPos, false);

    d.pointerId = event.pointerId;
    d.startX = event.clientX;
    d.active = false;
    d.samples = [{ t: event.timeStamp, x: event.clientX }];
  }, [apply]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (event.pointerId !== d.pointerId) return;

      if (!d.active) {
        if (Math.abs(event.clientX - d.startX) < DRAG_THRESHOLD_PX) return;
        d.active = true;
        d.startX = event.clientX; // start following from here, so there's no 6px jump
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // pointer already gone — the up/cancel handlers deal with it
        }
        setIsDragging(true);
      }

      d.samples.push({ t: event.timeStamp, x: event.clientX });
      while (d.samples.length > 2 && event.timeStamp - (d.samples[0]?.t ?? event.timeStamp) > 100) d.samples.shift();
      d.pendingDx = event.clientX - d.startX;
      if (!d.raf) {
        d.raf = requestAnimationFrame(() => {
          d.raf = 0;
          apply(positionForDrag(d.pendingDx), false);
        });
      }
    },
    [apply, positionForDrag],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
      const d = drag.current;
      if (event.pointerId !== d.pointerId) return;
      const wasActive = d.active;
      d.pointerId = -1;
      d.active = false;
      if (d.raf) cancelAnimationFrame(d.raf);
      d.raf = 0;
      if (!wasActive) return; // a plain tap/click — nothing to settle

      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // already released
      }

      const snaps = snapRef.current;
      const el = trackRef.current;
      const slideWidthPx = el ? (el.clientWidth * metricsRef.current.slideWidthPercent) / 100 : 1;
      const current = positionForDrag(d.pendingDx);

      const first = d.samples[0];
      const last = d.samples[d.samples.length - 1];
      const elapsed = last && first ? Math.max(1, last.t - first.t) : 1;
      const velocity = cancelled || !first || !last ? 0 : (last.x - first.x) / elapsed; // px/ms, + = forward

      const max = lastPoint(snaps);
      const projected = Math.max(0, Math.min(max, current + (velocity / slideWidthPx) * INERTIA_MS));
      let targetIndex = nearestIndex(snaps, projected);

      // A deliberate flick always moves at least one slide in its direction.
      if (!cancelled && Math.abs(velocity) > FLICK_SPEED && Math.abs(d.pendingDx) > FLICK_MIN_DISTANCE_PX) {
        const startIndex = nearestIndex(snaps, d.startPos);
        if (velocity > 0 && targetIndex <= startIndex) targetIndex = Math.min(snaps.length - 1, startIndex + 1);
        if (velocity < 0 && targetIndex >= startIndex) targetIndex = Math.max(0, startIndex - 1);
      }

      // The click that follows a mouse drag must not open the card under the cursor.
      d.suppressClick = true;
      setTimeout(() => {
        drag.current.suppressClick = false;
      }, 0);

      commit(pointAt(snaps, targetIndex));
      setIsDragging(false);
    },
    [commit, positionForDrag],
  );

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => finishDrag(event, false), [finishDrag]);
  const onPointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => finishDrag(event, true), [finishDrag]);

  const onClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  // Stop the browser's native link/image drag, which would otherwise cancel the pointer stream.
  const onDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => event.preventDefault(), []);

  // ----- horizontal trackpad swipe -----
  const stepByRef = useRef(stepBy);
  useEffect(() => {
    stepByRef.current = stepBy;
  });
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let accumulated = 0;
    let lastEventAt = 0;
    let locked = false;

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return; // vertical scrolling — leave the page alone
      event.preventDefault();
      const now = performance.now();
      if (now - lastEventAt > WHEEL_IDLE_MS) {
        locked = false; // a new gesture (the previous one's momentum tail has ended)
        accumulated = 0;
      }
      lastEventAt = now;
      if (locked) return;
      accumulated += event.deltaX;
      if (Math.abs(accumulated) >= WHEEL_STEP_PX) {
        // In this RTL track, finger/content moving right (deltaX < 0) reveals later slides.
        stepByRef.current(accumulated < 0 ? 1 : -1);
        accumulated = 0;
        locked = true; // one step per gesture, even though momentum keeps firing events
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return {
    /** Spread onto the track element: ref, drag handlers, and the touch-action/will-change it needs. */
    trackProps: {
      ref: trackRef,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
      onDragStart,
      style: { touchAction: "pan-y" as const, willChange: "transform" as const },
    },
    activeIndex: Math.round(position),
    slidesPerView: metrics.slidesPerView,
    isDragging,
    canGoPrev: position > EPS,
    canGoNext: position < maxPosition - EPS,
    stepBy,
    goToIndex,
  };
}
