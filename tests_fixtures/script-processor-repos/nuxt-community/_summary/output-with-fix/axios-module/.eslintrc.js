module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs'
  ],
  overrides: [
    {
      files: '*.js',
      extends: ['plugin:lodash-template/recommended-with-script'],
      parserOptions: {
        parser: 'vue-eslint-parser',
        parserOptions: {
        },
        sourceType: 'module'
      },
      globals: {
        options: true,
        serialize: true
      }
    }
  ]
}
