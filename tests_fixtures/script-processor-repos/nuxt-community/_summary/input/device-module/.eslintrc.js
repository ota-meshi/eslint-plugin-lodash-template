module.exports = {
  root: true,
  extends: [
    '@nuxtjs'
  ],
    overrides: [
      {
        files: "*.js",
        extends: ["plugin:lodash-template/recommended-with-script"],
        parserOptions: {
          parser: 'vue-eslint-parser',
          sourceType: 'module'
        },
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  }