module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  extends: ["@nuxtjs"],
  overrides: [
    {
      files: ["*.js"],
      extends: [
        "plugin:lodash-template/base"
      ],
      processor: "lodash-template/js",
      globals: {
        options: true,
        serialize: true,
      }
    }
  ]
};
