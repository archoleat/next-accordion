import type { DetailsHTMLAttributes, ReactNode } from 'react';

type Props = Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'children' | 'onToggle' | 'open'
> & {
  children: ReactNode;
  contentClassName?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  disableTriggerSelection?: boolean;
  duration?: number;
  easing?: string;
  icon?: ReactNode | ((isOpen: boolean) => ReactNode);
  onOpenChange?: (isOpen: boolean) => void;
  open?: boolean;
  trigger: ReactNode;
  triggerClassName?: string;
};

export type { Props };
