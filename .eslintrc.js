module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['backend/**/*.js'],
      env: {
        node: true,
        es2022: true,
      },
      extends: [
        'eslint:recommended',
      ],
      rules: {
        'no-console': 'off', 
      },
    },
    {
      files: ['frontend/src/**/*.{js,jsx}'],
      env: {
        browser: true,
        es2022: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      plugins: ['react', 'react-hooks'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off', 
        'react/prop-types': 'warn',
      },
    },
  ],
}; 