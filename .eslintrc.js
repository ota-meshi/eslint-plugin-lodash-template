"use strict"

const version = require("./package.json").version

module.exports = {
    extends: [
        "plugin:@mysticatea/es2015",
        "plugin:@mysticatea/+node",
        "plugin:@mysticatea/+eslint-plugin",
    ],
    plugins: ["es"],
    rules: {
        'require-jsdoc': 'error',
        "@mysticatea/eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
        "@mysticatea/eslint-plugin/require-meta-docs-url": [
            "error",
            {
                pattern: `https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v${version}/docs/rules/{{name}}.md`,
            },
        ],
        "mysticatea/arrow-parens": "off",
        "no-warning-comments": "warn",
        "linebreak-style": "off",
        "prefer-rest-params": "off",
        "prefer-spread": "off",

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
