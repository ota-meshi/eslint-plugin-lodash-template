"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
        parser: "babel-eslint",
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:all", "plugin:lodash-template/recommended-with-script", "plugin:lodash-template/all"]
}
