import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import securityPlugin from 'eslint-plugin-security';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tsPlugin,
      security: securityPlugin,
    },
    rules: {
      // ESLint core rules
      ...js.configs.recommended.rules,
      
      // React rules
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      
      // Console rules
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      
      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
    },
    settings: {
      react: {
        version: '18',
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        expect: true,
        jest: true,
        vi: true,
      },
    },
  },
];
