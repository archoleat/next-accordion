import { type MouseEvent, useLayoutEffect, useRef, useState } from 'react';

import { prefersReducedMotion } from '#utils/prefers-reduced-motion.ts';

import type { AccordionItemProps } from './accordion-item.props.ts';

const DEFAULT_ANIMATION_DURATION = 300;
const DEFAULT_ANIMATION_EASING = 'ease-out';

const AccordionItem = (props: AccordionItemProps) => {
  const {
    children,
    defaultOpen = false,
    disabled = false,
    disableTriggerSelection = false,
    duration = DEFAULT_ANIMATION_DURATION,
    easing = DEFAULT_ANIMATION_EASING,
    icon,
    onOpenChange,
    open,
    trigger,
    ...detailsProps
  } = props;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const isFirstRenderRef = useRef(true);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const onSummaryClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (detailsRef.current) {
      detailsRef.current.open = isOpen;
    }

    if (disabled) {
      return;
    }

    const nextOpen = !isOpen;

    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  useLayoutEffect(() => {
    const details = detailsRef.current;
    const summaryElement = summaryRef.current;
    const content = contentRef.current;

    if (!details || !summaryElement || !content) {
      return undefined;
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      details.open = isOpen;

      return undefined;
    }

    if (details.open === isOpen) {
      return undefined;
    }

    animationRef.current?.cancel();

    if (prefersReducedMotion() || duration <= 0) {
      details.open = isOpen;

      return undefined;
    }

    details.style.overflow = 'hidden';

    const onFinish = () => {
      details.open = isOpen;
      details.style.height = '';
      details.style.overflow = '';
      animationRef.current?.cancel();
      animationRef.current = null;
    };

    let frame: number | undefined;

    if (isOpen) {
      details.style.height = `${details.offsetHeight}px`;
      details.open = true;

      frame = window.requestAnimationFrame(() => {
        const startHeight = `${details.offsetHeight}px`;
        const endHeight = `${summaryElement.offsetHeight + content.offsetHeight}px`;

        animationRef.current = details.animate(
          { height: [startHeight, endHeight] },
          { duration, easing, fill: 'forwards' },
        );
        animationRef.current.addEventListener('finish', onFinish);
      });
    } else {
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summaryElement.offsetHeight}px`;

      animationRef.current = details.animate(
        { height: [startHeight, endHeight] },
        { duration, easing, fill: 'forwards' },
      );
      animationRef.current.addEventListener('finish', onFinish);
    }

    return () => {
      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
      }

      animationRef.current?.cancel();
    };
  }, [isOpen, duration, easing]);

  return (
    <details
      {...detailsProps}
      data-disabled={disabled || undefined}
      ref={detailsRef}
    >
      <summary
        aria-disabled={disabled}
        onClick={onSummaryClick}
        ref={summaryRef}
        style={{
          cursor: disabled ? undefined : 'pointer',
          listStyle: 'none',
          userSelect: disableTriggerSelection ? 'none' : undefined,
          WebkitUserSelect: disableTriggerSelection ? 'none' : undefined,
        }}
      >
        {trigger}
        {typeof icon === 'function' ? icon(isOpen) : icon}
      </summary>
      <div ref={contentRef} style={{ display: 'flow-root' }}>
        {children}
      </div>
    </details>
  );
};

export { AccordionItem };
