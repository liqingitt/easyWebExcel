module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'react-hooks/exhaustive-deps': 'warn'
  }
};
