module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react-native/no-inline-styles': 0,
        'prettier/prettier': [
          'error',
          {
            'no-inline-styles': false,
          },
        ],
      },
    },
  ],
};
