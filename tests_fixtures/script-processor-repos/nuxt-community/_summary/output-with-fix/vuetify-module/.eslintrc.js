module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config-typescript'],
  overrides: [
    {
      files: '*.js',
      extends: ['plugin:lodash-template/recommended-with-script'],
      parserOptions: {
        parser: 'vue-eslint-parser'
      },
      globals: {
        options: true,
        serialize: true,
        serializeFunction: true
      }
    }
  ]
}
