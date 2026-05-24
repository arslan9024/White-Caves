import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import securityPlugin from 'eslint-plugin-security';
import globals from 'globals';

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'archive/**',
      'archives/**',
      'logs/**',
      'attached_assets/**',
      'business_docs/**',
      'docs/**',
      'public/**',
      '**/*.min.js',
      'src/components/DocumentVerificationProcessor_placeholder.jsx',
      'test-leasing-inventory.js',
      'test-relational-sidebar-api.js',
      'test/sidebar-enhancements.test.ts',
    ],
  },
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
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
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
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-children-prop': 'off',

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/globals': 'warn',
      'react-hooks/immutability': 'off',
      'react-hooks/exhaustive-deps': 'off',

      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'off',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Console rules
      'no-console': 'off',

      // Security rules
      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'off',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'off',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-possible-timing-attacks': 'off',
      'no-useless-escape': 'off',
      'no-empty-pattern': 'off',
      'no-redeclare': 'warn',
      'no-irregular-whitespace': 'off',
      'no-case-declarations': 'off',
      'no-dupe-keys': 'off',
      'no-useless-catch': 'off',
      'no-empty': 'off',
      'no-control-regex': 'off',
      'no-prototype-builtins': 'warn',
      'no-dupe-class-members': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/use-callback': 'off',
      'react-hooks/error-boundaries': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
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
        test: true,
        __ENV: true,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-unsafe-regex': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['test/**/*.js', 'test-*.js'],
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
        test: true,
        __ENV: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: [
      'scripts/**/*.js',
      'api/**/*.js',
      'server/**/*.js',
      'backend/**/*.js',
      'test/**/*.js',
      'test-*.js',
      'run-api-tests.js',
      'src/services/PropertySourcingServices.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-console': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-unsafe-regex': 'off',
    },
  },
  {
    files: ['src/components/departmentViews/index.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
