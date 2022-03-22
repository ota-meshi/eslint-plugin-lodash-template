module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module"
  },
  extends: ["@nuxtjs"],
  overrides: [
    {
      files: "*.js",
      extends: ["plugin:lodash-template/recommended-with-script"],
      parserOptions: {
        parser: 'vue-eslint-parser',
        sourceType: 'module',
        parserOptions: {
        },
      },
      globals: {
        options: true,
        serialize: true,
      }
    }
  ]
};
