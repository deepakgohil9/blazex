import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/bin/**',
      '**/build/**',
      'eslint.config.mjs'
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      'no-console': 'error',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
  }
];
