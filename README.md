# Next Accordion

![NPM Version](https://img.shields.io/npm/v/%40archoleat%2Fnext-accordion)
![NPM Downloads](https://img.shields.io/npm/dm/%40archoleat%2Fnext-accordion)
![Specs](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/spec.yaml?label=Specs)
![Commitlint](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/commitlint.yaml?label=Commitlint)
![Editorconfig](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/editorconfig.yaml?label=Editorconfig)
![Prettier](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/prettier.yaml?label=Prettier)
![ESLint](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/eslint.yaml?label=ESLint)
![Remark](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/remark.yaml?label=Remark)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Styling](#styling)
- [Props](#props)
- [Types](#types)
- [Contributing](#contributing)
- [License](#license)

Animated React accordion using details and summary

## Installation

```sh
bun i -D @archoleat/next-accordion
```

## Usage

### Single item

Render a single collapsible panel:

```tsx
import { AccordionItem } from '@archoleat/next-accordion';

const Example = () => (
  <AccordionItem trigger="Trigger">
    <p>Content</p>
  </AccordionItem>
);

export { Example };
```

### List of items

Render a list of panels from an array of data:

```tsx
import { Accordion } from '@archoleat/next-accordion';

const items = [
  { id: 1, trigger: 'First', content: <p>First content</p> },
  { id: 2, trigger: 'Second', content: <p>Second content</p> },
];

const Example = () => <Accordion exclusive items={items} />;

export { Example };
```

`Accordion` renders each item as an `<li>` inside a wrapping `<ul>` (with
`className` applied to that `<ul>`), since a set of panels is semantically
a list. Browsers apply default list styling (markers, indent) to `<ul>`,
so reset it yourself — see [Styling](#styling).

### Compound components

Instead of `items`, compose `AccordionItem`s directly as children.
`Accordion` still coordinates the `exclusive` behavior between them:

```tsx
import { Accordion, AccordionItem } from '@archoleat/next-accordion';

const Example = () => (
  <Accordion exclusive>
    <AccordionItem trigger="First">
      <p>First content</p>
    </AccordionItem>
    <AccordionItem trigger="Second">
      <p>Second content</p>
    </AccordionItem>
  </Accordion>
);

export { Example };
```

Give each `AccordionItem` a `key` when the list can be reordered or
filtered; otherwise `Accordion` falls back to positional indexes to tell
items apart. `Accordion` accepts either `items` or `children`, not both.

### Controlling the open item from outside

In `exclusive` mode, which item is open lives inside `Accordion` by
default. Pass `openId` (paired with `onOpenIdChange`) to read or drive it
from outside — the same controlled/uncontrolled split `AccordionItem`
uses for `open`/`onOpenChange`:

```tsx
import { useState } from 'react';

import type { AccordionOpenIdType } from '@archoleat/next-accordion';
import { Accordion } from '@archoleat/next-accordion';

const items = [
  { id: 1, trigger: 'First', content: <p>First content</p> },
  { id: 2, trigger: 'Second', content: <p>Second content</p> },
];

const Example = () => {
  const [openId, setOpenId] = useState<AccordionOpenIdType>(1);

  return (
    <Accordion
      exclusive
      items={items}
      openId={openId}
      onOpenIdChange={setOpenId}
    />
  );
};

export { Example };
```

Uncontrolled usage works the same way `defaultOpen` does on `AccordionItem`:
pass `defaultOpenId` for the initial open item and read subsequent changes
through `onOpenIdChange`, without taking over the state yourself.

## Styling

The library ships no CSS of its own beyond what's needed for the open/close
animation, so every visual aspect is yours to style. The rendered markup
gives you the following hooks:

- `Accordion`'s `className` targets the wrapping `<ul>`.

- `AccordionItem`'s `className` (a forwarded native `details` attribute)
  targets that item's `<details>`.

- `AccordionItem`'s `triggerClassName` and `contentClassName` target
  the `<summary>` and the panel wrapper `<div>` directly — no need to
  reach for descendant selectors.

- `trigger` is a `ReactNode`, so wrap it in your own elements to style
  the label.

- `<details open>` and a disabled item's `data-disabled` are both plain
  attributes, so Tailwind's `open:` and `data-[disabled]:` variants apply
  directly — no need for the `icon` function-of-`isOpen` form just to
  rotate a chevron.

The example below uses [`cn`](https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper),
the common `clsx` + `tailwind-merge` helper, to combine a shared base
class with any per-item override:

```tsx
import { Accordion } from '@archoleat/next-accordion';

import { cn } from './lib/cn';

const ChevronIcon = () => (
  <svg
    aria-hidden
    className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
    height="16"
    viewBox="0 0 16 16"
    width="16"
  >
    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const items = [
  { id: 1, trigger: 'First', content: <p>First content</p> },
  { id: 2, trigger: 'Second', content: <p>Second content</p> },
];

const Example = () => (
  <Accordion
    className="m-0 flex list-none flex-col gap-2 p-0"
    exclusive
    items={items.map((item) => ({
      ...item,
      className: 'overflow-hidden rounded-lg border border-slate-200',
      contentClassName: 'p-4 pt-0',
      duration: 250,
      easing: 'ease-in-out',
      icon: <ChevronIcon />,
      triggerClassName: cn(
        'flex cursor-pointer items-center justify-between p-4',
        'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      ),
    }))}
  />
);

export { Example };
```

## Props

<!-- lint disable maximum-line-length -->

### `Accordion`

| Prop        | Type                | Default | Description                                                                                                                                            |
| ----------- | ------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`     | `AccordionItemDataType[]` | —       | Data rendered as a list of `AccordionItem`s. Each entry accepts `id` (`number`), `trigger`, `content`, plus every `AccordionItem` prop below (except `children`, which maps to `content`). Mutually exclusive with `children`. |
| `children`  | `ReactNode`         | —       | `AccordionItem` elements composed directly (compound component pattern). Mutually exclusive with `items`.                                            |
| `className` | `string`            | —       | Class applied to the wrapping `ul`. Each item is rendered inside its own `li`.                                                                        |
| `exclusive` | `boolean`           | `false` | When `true`, opening one item closes the others.                                                                                                       |
| `openId`    | `AccordionOpenIdType`   | —       | Id of the currently open item (controlled). Only meaningful when `exclusive` is `true`. Pair with `onOpenIdChange`.                                   |
| `defaultOpenId` | `AccordionOpenIdType` | `null` | Initial open item id (uncontrolled). Only meaningful when `exclusive` is `true`.                                                                  |
| `onOpenIdChange` | `(openId: AccordionOpenIdType) => void` | — | Called when the open item changes in `exclusive` mode.                                                                                     |

### `AccordionItem`

| Prop                      | Type                                          | Default        | Description                                                                                   |
| ------------------------- | ---------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `trigger`                 | `ReactNode`                                    | —              | Content rendered inside the `summary` element. **Required.**                                    |
| `children`                | `ReactNode`                                    | —              | Content rendered inside the accordion panel. **Required.**                                       |
| `defaultOpen`              | `boolean`                                      | `false`        | Initial expanded state (uncontrolled).                                                          |
| `open`                    | `boolean`                                      | —              | Expanded state (controlled). Pair with `onOpenChange`.                                          |
| `onOpenChange`             | `(isOpen: boolean) => void`                    | —              | Called when the trigger is clicked.                                                             |
| `disabled`                | `boolean`                                      | `false`        | Ignores clicks on the trigger.                                                                   |
| `duration`                | `number`                                       | `300`          | Animation duration in milliseconds.                                                              |
| `easing`                  | `string`                                       | `'ease-in-out'` | Animation easing, passed to the Web Animations API.                                            |
| `icon`                    | `ReactNode \| (isOpen: boolean) => ReactNode`  | —              | Rendered after `trigger`; the function form receives the open state.                            |
| `disableTriggerSelection` | `boolean`                                      | `false`        | Prevents text selection on the trigger (e.g. on double-click).                                  |
| `triggerClassName`        | `string`                                       | —              | Class applied to the `summary` element.                                                         |
| `contentClassName`        | `string`                                       | —              | Class applied to the panel wrapper `div`.                                                        |

<!-- lint enable maximum-line-length -->

All other native `details` attributes (`id`, `className`, and so on) are
forwarded to the underlying `<details>` element. The animation is skipped
in favor of an instant toggle when the user has `prefers-reduced-motion`
enabled.

## Types

`@archoleat/next-accordion` exports the prop types for both components,
plus the shape used by `items` and by the open-item id, so you can type
your own code around them without redeclaring the definitions.

`AccordionOpenIdType` (`number | string | null`) is the type of `openId`,
`defaultOpenId`, and the argument passed to `onOpenIdChange` — see
[Controlling the open item from outside](#controlling-the-open-item-from-outside).

Type an `items` array built outside JSX with `AccordionItemDataType`:

```tsx
import type { AccordionItemDataType } from '@archoleat/next-accordion';

const items: AccordionItemDataType[] = [
  { id: 1, trigger: 'First', content: <p>First content</p> },
  { id: 2, trigger: 'Second', content: <p>Second content</p> },
];

export { items };
```

Type a wrapper component with `AccordionProps` / `AccordionItemProps`:

```tsx
import { Accordion, AccordionItem } from '@archoleat/next-accordion';
import type {
  AccordionItemProps,
  AccordionProps,
} from '@archoleat/next-accordion';

const FaqAccordion = (props: AccordionProps) => (
  <Accordion className="faq" {...props} />
);

const FaqItem = (props: AccordionItemProps) => (
  <AccordionItem duration={300} {...props} />
);

export { FaqAccordion, FaqItem };
```

## Contributing

Please read [**CONTRIBUTING**](https://github.com/archoleat/.github/blob/main/CONTRIBUTING.md)
to start contributing.

## License

This project is licensed under the [**MIT license**](LICENSE).
