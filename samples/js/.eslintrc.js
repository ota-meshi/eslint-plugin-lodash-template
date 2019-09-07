"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  env: {},
  extends: ["eslint:all"],
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:lodash-template/all"],
      processor: "lodash-template/js"
    }
  ]
};
