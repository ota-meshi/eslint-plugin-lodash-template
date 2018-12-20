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
            globals: {window:true},
            rules: {
                // for prettier
                "@mysticatea/vue/html-closing-bracket-newline": "off",
                "@mysticatea/vue/singleline-html-element-content-newline": "off",
                "@mysticatea/vue/multiline-html-element-content-newline": "off",
                "@mysticatea/vue/html-self-closing": "off",
                "@mysticatea/vue/max-attributes-per-line": "off",
                "@mysticatea/vue/html-indent": "off"
            },
        },
        {
            files: ["lib/**/*.js"],
            globals: {window:true},
            rules:{
                "@mysticatea/node/no-unsupported-features/es-syntax": "off",
            }
        }
    ],
}