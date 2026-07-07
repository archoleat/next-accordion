import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

if (!Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    const listeners = new Map<string, () => void>();

    const animation = {
      addEventListener: (type: string, listener: () => void) => {
        listeners.set(type, listener);

        if (type === 'finish') {
          queueMicrotask(listener);
        }
      },
      removeEventListener: (type: string) => {
        listeners.delete(type);
      },
      cancel: () => {
        listeners.get('cancel')?.();
      },
      finish: () => {
        listeners.get('finish')?.();
      },
    };

    return animation as unknown as Animation;
  };
}
