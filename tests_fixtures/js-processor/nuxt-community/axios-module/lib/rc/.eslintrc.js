module.exports = {
    root: true,
    parserOptions: {
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: 'babel-eslint',
      },
      sourceType: 'module'
    },
    extends: [
      '@nuxtjs', "plugin:lodash-template/base"
    ],
    overrides: [
      {
        files: ["*.js"],
        processor: "lodash-template/js",
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  }