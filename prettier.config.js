import { defineConfig } from '@archoleat/prettier-define-config';

export default defineConfig({
  overrides: [
    {
      files: ['*.js', '*.tsx', '*.ts', '*.yaml'],
      options: {
        singleQuote: true,
      },
    },
  ],
});
