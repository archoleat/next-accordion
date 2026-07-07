import type { ReactNode } from 'react';

import type { AccordionItemProps } from './accordion-item.props.ts';

type AccordionItemData = Omit<AccordionItemProps, 'children' | 'content' | 'id'> & {
  content: ReactNode;
  id: number;
};

type AccordionProps = {
  className?: string;
  exclusive?: boolean;
  items: AccordionItemData[];
};

export type { AccordionItemData, AccordionProps };
