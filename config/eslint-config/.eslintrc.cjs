/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    '@typescript-eslint/no-require-imports': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-async-promise-executor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'import/no-extraneous-dependencies': 'off', // needed for the monorepo
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    'arrow-body-style': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'internal'],
          'external',
          ['index', 'parent', 'sibling'],
          'object',
          'type',
        ],
        distinctGroup: true,
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
    'unused-imports/no-unused-imports': 'error',
  },

  ignorePatterns: ['.eslintrc.cjs', 'dist', 'turbo', 'coverage'],
};
