"use strict"


module.exports = {
    extends: [
        "plugin:@mysticatea/+modules"
    ],
    plugins: [],
    rules: {
        "no-warning-comments": "warn",
        "require-jsdoc": "off",

        "@mysticatea/eslint-plugin/require-meta-docs-url": "off",
        "es/no-regexp-u-flag": "off",
        "require-unicode-regexp": "error",
    },

    overrides: [
        {
            files: ["**/*.vue"],
            rules: {
                "@mysticatea/prettier": "off",
            },
        },
        {
            files: ["lib/*.js"],
            rules:{
                "@mysticatea/node/no-unsupported-features/es-syntax": "off",
            }
        }
    ],
}