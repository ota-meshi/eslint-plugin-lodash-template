"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  env: {},
  extends: [
    "eslint:all",
    "plugin:lodash-template/base",
    "plugin:lodash-template/recommended-with-script"
  ],
  rules: {
    "no-undef": "off",
    "indent": "off",
    semi: ["error", "never"]
  }
};
