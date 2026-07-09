import { describe, expect, mock, test as spec } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';

import { Accordion, AccordionItem } from '#src/index.tsx';

describe('AccordionItem', () => {
  spec('should render the summary and keep the content collapsed by default', () => {
    render(
      <AccordionItem trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    expect(screen.getByText('Summary')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
    expect(screen.getByText('Summary').closest('details')?.open).toBe(false);
  });

  spec('should render open when the defaultOpen prop is set', () => {
    render(
      <AccordionItem defaultOpen trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    expect(screen.getByText('Summary').closest('details')?.open).toBe(true);
  });

  spec('should open on summary click when uncontrolled', () => {
    render(
      <AccordionItem trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    fireEvent.click(screen.getByText('Summary'));

    expect(screen.getByText('Summary').closest('details')?.open).toBe(true);
  });

  spec(
    'should close on summary click when already open and uncontrolled',
    async () => {
      render(
        <AccordionItem defaultOpen trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      fireEvent.click(screen.getByText('Summary'));

      await Promise.resolve();

      expect(screen.getByText('Summary').closest('details')?.open).toBe(false);
    },
  );

  spec('should not drift when the parent re-renders for an unrelated reason', () => {
    const { rerender } = render(
      <AccordionItem className="a" trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    fireEvent.click(screen.getByText('Summary'));

    expect(screen.getByText('Summary').closest('details')?.open).toBe(true);

    rerender(
      <AccordionItem className="b" trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    expect(screen.getByText('Summary').closest('details')?.open).toBe(true);
  });

  spec(
    'should call onOpenChange instead of toggling itself in controlled mode',
    () => {
      const onOpenChange = mock();

      render(
        <AccordionItem onOpenChange={onOpenChange} open={false} trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      fireEvent.click(screen.getByText('Summary'));

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.getByText('Summary').closest('details')?.open).toBe(false);
    },
  );

  spec(
    'should reflect the open prop once the parent updates it in controlled mode',
    () => {
      const { rerender } = render(
        <AccordionItem open={false} trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      rerender(
        <AccordionItem open trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      expect(screen.getByText('Summary').closest('details')?.open).toBe(true);
    },
  );

  spec('should ignore clicks when disabled', () => {
    const onOpenChange = mock();

    render(
      <AccordionItem disabled onOpenChange={onOpenChange} trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    fireEvent.click(screen.getByText('Summary'));

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('Summary').closest('details')?.open).toBe(false);
  });

  spec(
    'should disable text selection on the trigger when disableTriggerSelection is set',
    () => {
      render(
        <AccordionItem disableTriggerSelection trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      expect(screen.getByText('Summary').closest('summary')?.style.userSelect).toBe(
        'none',
      );
    },
  );

  spec('should apply triggerClassName to the summary element', () => {
    render(
      <AccordionItem triggerClassName="trigger" trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    expect(screen.getByText('Summary').closest('summary')?.className).toBe(
      'trigger',
    );
  });

  spec('should apply contentClassName to the panel wrapper', () => {
    render(
      <AccordionItem contentClassName="panel" trigger="Summary">
        <p>Content</p>
      </AccordionItem>,
    );

    expect(screen.getByText('Content').closest('div')?.className).toBe('panel');
  });

  spec(
    'should open immediately, without animating, when the user prefers reduced motion',
    () => {
      const originalMatchMedia = window.matchMedia;

      window.matchMedia = (query: string) =>
        ({ matches: true, media: query }) as MediaQueryList;

      render(
        <AccordionItem trigger="Summary">
          <p>Content</p>
        </AccordionItem>,
      );

      fireEvent.click(screen.getByText('Summary'));

      expect(screen.getByText('Summary').closest('details')?.open).toBe(true);

      window.matchMedia = originalMatchMedia;
    },
  );
});

describe('Accordion', () => {
  spec('should render items as li elements inside a ul', () => {
    const { container } = render(
      <Accordion
        className="accordion"
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    const list = container.querySelector('ul.accordion');

    expect(list).not.toBeNull();
    expect(list?.children).toHaveLength(2);
    expect(list?.children[0]?.tagName).toBe('LI');
    expect(list?.children[0]?.querySelector('details')).not.toBeNull();
  });

  spec('should render an item for every entry in the data array', () => {
    render(
      <Accordion
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByText('First content')).toBeDefined();
    expect(screen.getByText('Second content')).toBeDefined();
  });

  spec('should toggle items independently by default', () => {
    render(
      <Accordion
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('First'));

    expect(screen.getByText('First').closest('details')?.open).toBe(true);
    expect(screen.getByText('Second').closest('details')?.open).toBe(false);
  });

  spec('should close the previously open item when exclusive is set', async () => {
    render(
      <Accordion
        exclusive
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('First'));

    expect(screen.getByText('First').closest('details')?.open).toBe(true);

    fireEvent.click(screen.getByText('Second'));

    await Promise.resolve();

    expect(screen.getByText('First').closest('details')?.open).toBe(false);
    expect(screen.getByText('Second').closest('details')?.open).toBe(true);
  });

  spec('should report the open item id via onOpenIdChange', () => {
    const onOpenIdChange = mock();

    render(
      <Accordion
        exclusive
        onOpenIdChange={onOpenIdChange}
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('First'));

    expect(onOpenIdChange).toHaveBeenCalledWith(1);
  });

  spec('should let openId control which item is open from outside', () => {
    const onOpenIdChange = mock();

    const { rerender } = render(
      <Accordion
        exclusive
        openId={null}
        onOpenIdChange={onOpenIdChange}
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('First'));

    expect(onOpenIdChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('First').closest('details')?.open).toBe(false);

    rerender(
      <Accordion
        exclusive
        openId={1}
        onOpenIdChange={onOpenIdChange}
        items={[
          { content: <p>First content</p>, id: 1, trigger: 'First' },
          { content: <p>Second content</p>, id: 2, trigger: 'Second' },
        ]}
      />,
    );

    expect(screen.getByText('First').closest('details')?.open).toBe(true);
  });

  spec(
    'should render AccordionItem children passed via the compound pattern',
    () => {
      render(
        <Accordion>
          <AccordionItem trigger="First">
            <p>First content</p>
          </AccordionItem>
          <AccordionItem trigger="Second">
            <p>Second content</p>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByText('First')).toBeDefined();
      expect(screen.getByText('Second')).toBeDefined();
      expect(screen.getByText('First content')).toBeDefined();
      expect(screen.getByText('Second content')).toBeDefined();
    },
  );

  spec('should toggle compound children independently by default', () => {
    render(
      <Accordion>
        <AccordionItem trigger="First">
          <p>First content</p>
        </AccordionItem>
        <AccordionItem trigger="Second">
          <p>Second content</p>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByText('First'));

    expect(screen.getByText('First').closest('details')?.open).toBe(true);
    expect(screen.getByText('Second').closest('details')?.open).toBe(false);
  });

  spec(
    'should close the previously open compound child when exclusive is set',
    async () => {
      render(
        <Accordion exclusive>
          <AccordionItem trigger="First">
            <p>First content</p>
          </AccordionItem>
          <AccordionItem trigger="Second">
            <p>Second content</p>
          </AccordionItem>
        </Accordion>,
      );

      fireEvent.click(screen.getByText('First'));

      expect(screen.getByText('First').closest('details')?.open).toBe(true);

      fireEvent.click(screen.getByText('Second'));

      await Promise.resolve();

      expect(screen.getByText('First').closest('details')?.open).toBe(false);
      expect(screen.getByText('Second').closest('details')?.open).toBe(true);
    },
  );
});
