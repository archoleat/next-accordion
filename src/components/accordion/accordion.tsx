import { Children, cloneElement, isValidElement, useState } from 'react';

import type { Props as AccordionItemProps } from '../accordion-item/accordion-item.props.ts';
import { AccordionItem } from '../accordion-item/accordion-item.tsx';
import type { OpenIdType, Props as AccordionProps } from './accordion.props.ts';

const Accordion = (props: AccordionProps) => {
  const {
    className,
    defaultOpenId = null,
    exclusive = false,
    onOpenIdChange,
  } = props;

  const [uncontrolledOpenId, setUncontrolledOpenId] =
    useState<OpenIdType>(defaultOpenId);

  const isControlled = props.openId !== undefined;
  const openId = isControlled ? props.openId : uncontrolledOpenId;

  const setOpenId = (nextOpenId: OpenIdType) => {
    if (!isControlled) {
      setUncontrolledOpenId(nextOpenId);
    }

    onOpenIdChange?.(nextOpenId);
  };

  if (props.items) {
    return (
      <ul className={className}>
        {props.items.map(({ content, id, onOpenChange, ...restItemProps }) => {
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
            <li key={id}>
              <AccordionItem {...restItemProps} {...changeProps} {...openProps}>
                {content}
              </AccordionItem>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={className}>
      {Children.map(props.children, (child, index) => {
        const id = isValidElement(child) ? (child.key ?? index) : index;

        if (
          !isValidElement<AccordionItemProps>(child) ||
          child.type !== AccordionItem
        ) {
          return <li key={id}>{child}</li>;
        }

        const openProps = exclusive
          ? {
              onOpenChange: (isOpen: boolean) => {
                setOpenId(isOpen ? id : null);
                child.props.onOpenChange?.(isOpen);
              },
              open: openId === id,
            }
          : {};

        return <li key={id}>{cloneElement(child, openProps)}</li>;
      })}
    </ul>
  );
};

export { Accordion };
