import { defineFlatConfig } from 'eslint-define-config';
import { fixupPluginRules } from '@eslint/compat';
import eslintPluginReactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import importSortPlugin from 'eslint-plugin-simple-import-sort';
import parser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import unicornPlugin from 'eslint-plugin-unicorn';

export default defineFlatConfig([
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser,
      globals: {
        ...globals.browser,
        ...globals.es2015,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooksPlugin),
      'simple-import-sort': importSortPlugin,
      import: importPlugin,
      react: fixupPluginRules(reactPlugin),
      unicorn: unicornPlugin,
    },
    rules: {
      'import/exports-last': 'error',
      'import/extensions': ['error', { ts: 'always', tsx: 'always' }],
      'import/group-exports': 'error',
      'import/no-commonjs': 'error',
      'import/no-default-export': 'off',
      'import/no-namespace': 'error',
      'import/no-unassigned-import': 'error',
      'import/prefer-default-export': 'off',
      'react/destructuring-assignment': ['error', 'always'],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-curly-brace-presence': 'warn',
      'react/jsx-sort-props': 'warn',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
      'unicorn/no-unused-properties': 'warn',
    },
  },
  prettierConfig,
]);
