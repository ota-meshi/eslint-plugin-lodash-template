"use strict"

const version = require("./package.json").version

module.exports = {
    parserOptions: {
        parser: "babel-eslint"
    },
    extends: [
        "plugin:@mysticatea/es2015",
        "plugin:@mysticatea/+node",
        "plugin:@mysticatea/+eslint-plugin",
    ],
    plugins: ["es"],
    rules: {
        "@mysticatea/eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
        "@mysticatea/eslint-plugin/require-meta-docs-url": [
            "error",
            {
                pattern: `https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v${version}/docs/rules/{{name}}.md`,
            },
        ],
        'require-jsdoc': 'error',
        "no-warning-comments": "warn",

        // for Node.js V4
        "require-unicode-regexp": "off",
        "es/no-regexp-u-flag": "error"
    },

    overrides: [
        {
            files: ["scripts/*.js"],
            rules: {
                "require-jsdoc": "off",
            },
        },
    ],
}
