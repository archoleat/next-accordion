import { useState } from 'react';

import type { AccordionItemData, AccordionProps } from './accordion.props.ts';
import { AccordionItem } from './accordion-item.tsx';

const Accordion = (props: AccordionProps) => {
  const { className, exclusive = false, items } = props;

  const [openId, setOpenId] = useState<AccordionItemData['id'] | null>(null);

  return (
    <div className={className}>
      {items.map(({ content, id, onOpenChange, ...restItemProps }) => {
        const openProps = exclusive
          ? {
              onOpenChange: (isOpen: boolean) => {
                setOpenId(isOpen ? id : null);
                onOpenChange?.(isOpen);
              },
              open: openId === id,
            }
          : {};
        const changeProps = !exclusive && onOpenChange ? { onOpenChange } : {};

        return (
          <AccordionItem key={id} {...restItemProps} {...changeProps} {...openProps}>
            {content}
          </AccordionItem>
        );
      })}
    </div>
  );
};

export { Accordion };
export type { AccordionItemData, AccordionProps };
