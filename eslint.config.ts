import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import type { Linter } from 'eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'storybook-static/**', '*.config.js', '*.config.ts'],
  },
  js.configs.recommended,

  // App / shared TS code (browser by default)
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'storybook-static/**', '*.config.js', '*.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser globals to avoid no-undef for DOM APIs
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        HTMLInputElement: 'readonly',
        ClipboardItem: 'readonly',
        console: 'readonly',
        HTMLDivElement: 'readonly',
        MouseEvent: 'readonly',
        Node: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint as any,
      prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Jest tests
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },

  // Node server (process, console) + keep prettier happy
  {
    files: ['server/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },

  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'storybook-static/', 'stories/'],
  },
] satisfies Linter.Config[];
