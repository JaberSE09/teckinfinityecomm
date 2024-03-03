module.exports = {
  root: true,
  extends: ['plugin:@next/next/recommended', '@payloadcms'],
  ignorePatterns: ['**/payload-types.ts'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    'no-trailing-spaces': 'error',
    'eol-last': 0,
  },
}
