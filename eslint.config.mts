import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 🧹 Files to ignore (replaces .eslintignore)
  {
    ignores: ['node_modules', 'dist', 'build'],
  },

  // ✅ Base JS + TS recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ✅ Project rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __DEV__: true,
      },
    },

    settings: {
      react: { version: 'detect' },
    },

    // ✅ Flat-config-compatible plugin definitions (objects, not arrays)
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },

    // ✅ Rules
    rules: {
      // --- JS / TS ---
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[1].rules,

      // --- React / React-Native ---
      ...reactPlugin.configs.recommended.rules,
      ...reactNativePlugin.configs.all.rules,

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'warn',

      // --- Prettier integration ---
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          semi: true,
        },
      ],
    },
  },
]);
