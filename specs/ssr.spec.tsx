import { describe, expect, test as spec } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { AccordionItem } from '#src/index.tsx';

describe('AccordionItem server rendering', () => {
  for (const props of [{ defaultOpen: true }, { open: true }]) {
    spec(`should include the open attribute for ${JSON.stringify(props)}`, () => {
      const html = renderToStaticMarkup(
        <AccordionItem {...props} trigger="Summary">
          Content
        </AccordionItem>,
      );

      expect(html).toMatch(/<details[^>]* open=""/);
    });
  }

  spec('should let the controlled prop override defaultOpen', () => {
    const html = renderToStaticMarkup(
      <AccordionItem defaultOpen open={false} trigger="Summary">
        Content
      </AccordionItem>,
    );

    expect(html).not.toMatch(/<details[^>]* open/);
  });
});
