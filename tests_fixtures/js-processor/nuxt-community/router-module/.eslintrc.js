module.exports = {
    root: true,
    extends: [
      '@nuxtjs'
    ],
    overrides: [
      {
        files: ["*.js"],
        extends: [
          "plugin:lodash-template/recommended-with-js"
        ],
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