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
            processor: "lodash-template/script",
            parserOptions: {
                ecmaVersion: 2019,
                parser: "babel-eslint",
            },
            globals: {
                options: true,
                serialize: true,
                process: true,
                require: true,
            },
            rules: {
                "one-var": "off",
                "lodash-template/prefer-escape-template-interpolations": "off",
            },
        },
    ],
}
