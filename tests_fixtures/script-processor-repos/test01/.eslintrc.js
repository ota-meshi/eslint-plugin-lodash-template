"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:all", "plugin:lodash-template/recommended-with-script", "plugin:lodash-template/all"]
}
