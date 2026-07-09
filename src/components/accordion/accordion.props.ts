import type { ReactNode } from 'react';

import type { Props as AccordionItemProps } from '../accordion-item/accordion-item.props.ts';

type AccordionItemDataType = Omit<
  AccordionItemProps,
  'children' | 'content' | 'id'
> & {
  content: ReactNode;
  id: number;
};

type OpenIdType = number | string | null;

type SharedProps = {
  className?: string;
  defaultOpenId?: OpenIdType;
  exclusive?: boolean;
  onOpenIdChange?: (openId: OpenIdType) => void;
  openId?: OpenIdType;
};

type ItemsProps = SharedProps & {
  children?: never;
  items: AccordionItemDataType[];
};

type ChildrenProps = SharedProps & {
  children: ReactNode;
  items?: never;
};

type Props = ChildrenProps | ItemsProps;

export type { AccordionItemDataType, OpenIdType, Props };
