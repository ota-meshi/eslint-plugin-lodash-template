module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs'
  ],
    overrides: [
      {
        files: "*.js",
        extends: ["plugin:lodash-template/recommended-with-script"],
        parserOptions: {
          parser: 'vue-eslint-parser',
          sourceType: 'module',
          parserOptions: {
            ecmaVersion: 2022,
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