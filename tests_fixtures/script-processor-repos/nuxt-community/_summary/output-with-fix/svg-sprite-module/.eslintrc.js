module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs'
  ],
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  },
  overrides: [
    {
      files: '*.js',
      extends: ['plugin:lodash-template/recommended-with-script'],
      parserOptions: {
        parser: 'vue-eslint-parser',
        sourceType: 'module'
      },
      globals: {
        options: true,
        serialize: true
      }
    }
  ]
}
