# Next Accordion

![Specs](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/spec.yaml?label=Specs)
![Commitlint](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/commitlint.yaml?label=Commitlint)
![Editorconfig](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/editorconfig.yaml?label=Editorconfig)
![Prettier](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/prettier.yaml?label=Prettier)
![ESLint](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/eslint.yaml?label=ESLint)
![Remark](https://img.shields.io/github/actions/workflow/status/archoleat/next-accordion/remark.yaml?label=Remark)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
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

## Props

### `Accordion`

- `items` (`AccordionItemData[]`, required): data rendered as a list
  of `AccordionItem`s. Each entry accepts `id` (`number`), `trigger`,
  `content`, plus every `AccordionItem` prop below (except `children`,
  which maps to `content`).

- `className` (`string`): class applied to the wrapping `div`.

- `exclusive` (`boolean`, default `false`): when `true`, opening one
  item closes the others.

### `AccordionItem`

- `trigger` (`ReactNode`, required): content rendered inside
  the `summary` element.

- `children` (`ReactNode`, required): content rendered inside
  the accordion panel.

- `defaultOpen` (`boolean`, default `false`): initial expanded state
  (uncontrolled).

- `open` (`boolean`): expanded state (controlled). Pair
  with `onOpenChange`.

- `onOpenChange` (`(isOpen: boolean) => void`): called when the trigger
  is clicked.

- `disabled` (`boolean`, default `false`): ignores clicks on the trigger.

- `duration` (`number`, default `300`): animation duration
  in milliseconds.

- `easing` (`string`, default `'ease-out'`): animation easing, passed
  to the Web Animations API.

- `icon` (`ReactNode` or `(isOpen: boolean) => ReactNode`): rendered
  after `trigger`; the function form receives the open state.

- `disableTriggerSelection` (`boolean`, default `false`): prevents text
  selection on the trigger (e.g. on double-click).

All other native `details` attributes (`id`, `className`, and so on) are
forwarded to the underlying `<details>` element. The animation is skipped
in favor of an instant toggle when the user has `prefers-reduced-motion`
enabled.

## Contributing

Please read [**CONTRIBUTING**](https://github.com/archoleat/.github/blob/main/CONTRIBUTING.md)
to start contributing.

## License

This project is licensed under the [**MIT license**](LICENSE).
