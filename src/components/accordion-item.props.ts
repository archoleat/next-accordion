import type { DetailsHTMLAttributes, ReactNode } from 'react';

type AccordionItemProps = Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'children' | 'onToggle' | 'open'
> & {
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  disableTriggerSelection?: boolean;
  duration?: number;
  easing?: string;
  icon?: ReactNode | ((isOpen: boolean) => ReactNode);
  onOpenChange?: (isOpen: boolean) => void;
  open?: boolean;
  trigger: ReactNode;
};

export type { AccordionItemProps };
