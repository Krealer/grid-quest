import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    env: {
      browser: true,
      jest: true
    },
    rules: {}
  }
];
