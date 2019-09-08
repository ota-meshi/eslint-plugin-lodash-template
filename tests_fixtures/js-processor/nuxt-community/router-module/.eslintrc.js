module.exports = {
    root: true,
    extends: [
      '@nuxtjs'
    ],
    overrides: [
      {
        files: ["*.js"],
        extends: [
          "plugin:lodash-template/base"
        ],
        processor: "lodash-template/js",
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