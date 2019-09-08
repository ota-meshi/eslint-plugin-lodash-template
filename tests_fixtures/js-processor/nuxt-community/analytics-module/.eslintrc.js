module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  extends: ["@nuxtjs"],
  overrides: [
    {
      files: "*.js",
      extends: [
        "plugin:lodash-template/recommended-with-js"
      ],
      globals: {
        options: true,
        serialize: true,
      }
    }
  ]
};
