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
        files: ["*.js"],
        extends: [
          "plugin:lodash-template/base"
        ],
        parserOptions: {
          parser: 'vue-eslint-parser',
          parserOptions: {
            parser: 'babel-eslint',
          },
          sourceType: 'module'
        },
        processor: "lodash-template/js",
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  }