module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript"],
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:lodash-template/recommended-with-js"],
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
};
