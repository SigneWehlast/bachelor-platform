import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    rules: {
      'brace-style': 'error',
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'no-eval': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
      'no-trailing-spaces': 'error',
      'no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': ['error'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  }
]);