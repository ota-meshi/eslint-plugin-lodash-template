"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  env: {},
  extends: ["eslint:all", "plugin:lodash-template/all"],
  overrides: [
    {
      files: ["*.js"],
      processor: "lodash-template/js"
    }
  ]
};
