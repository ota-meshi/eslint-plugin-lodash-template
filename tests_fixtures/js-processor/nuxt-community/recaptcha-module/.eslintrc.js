module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs'
  ],
    overrides: [
      {
        files: "*.js",
        extends: ["plugin:lodash-template/recommended-with-js"],
        parserOptions: {
          parser: 'vue-eslint-parser',
          sourceType: 'module',
          parserOptions: {
            parser: 'babel-eslint',
            sourceType: 'module'
          },
        },
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  }