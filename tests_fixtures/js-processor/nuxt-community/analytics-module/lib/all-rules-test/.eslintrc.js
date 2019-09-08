"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:all", "plugin:lodash-template/all"],
    overrides: [
        {
            files: "*.js",
            processor: "lodash-template/js",
            parserOptions: {
                ecmaVersion: 2019,
                parser: "babel-eslint",
            },
            globals: {
                options: true,
            },
            rules: {
                "one-var": "off",
                "lodash-template/prefer-escape-template-interpolations": "off",
            },
        },
    ],
}
