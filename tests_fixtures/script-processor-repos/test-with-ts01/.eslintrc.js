"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
    },
    overrides: [
        {
            files: ["*.ts"],
            extends: ["eslint:all", "plugin:lodash-template/recommended-with-script", "plugin:lodash-template/all"],
            parserOptions: {
                parser: "@typescript-eslint/parser"
            }
        },
    ]
}
