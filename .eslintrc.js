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
        "plugin:lodash-template/all"
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
