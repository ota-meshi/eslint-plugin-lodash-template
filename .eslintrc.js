"use strict";

module.exports = {
    parserOptions: {
        sourceType: "script",
        ecmaVersion: 2020,
    },
    extends: [
        "plugin:lodash-template/all",
        "plugin:@ota-meshi/recommended",
        "plugin:@ota-meshi/+node",
        "plugin:@ota-meshi/+eslint-plugin",
        "plugin:@ota-meshi/+json",
        "plugin:@ota-meshi/+package-json",
        "plugin:@ota-meshi/+yaml",
        // "plugin:@ota-meshi/+md",
        "plugin:@ota-meshi/+prettier",
    ],
    plugins: ["es"],
    rules: {
        "require-jsdoc": "error",
        "no-warning-comments": "warn",
        "regexp/no-obscure-range": ["error", { allowed: "all" }],
    },
    overrides: [
        {
            files: ["lib/rules/**"],
            rules: {
                "eslint-plugin/require-meta-docs-description": [
                    "error",
                    { pattern: "^(enforce|require|disallow|prefer)" },
                ],
                "eslint-plugin/report-message-format": [
                    "error",
                    "[^a-z].*\\.$",
                ],
                "eslint-plugin/require-meta-docs-url": [
                    "error",
                    {
                        pattern:
                            "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/{{name}}.html",
                    },
                ],
            },
        },
        {
            files: ["scripts/*.js"],
            rules: {
                "require-jsdoc": "off",
            },
        },
        {
            files: ["docs/.vuepress/**"],
            parser: "vue-eslint-parser",
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2020,
            },
            extends: ["plugin:@ota-meshi/+vue2", "plugin:@ota-meshi/+prettier"],
            globals: {
                window: true,
            },
            rules: {
                "require-jsdoc": "off",
                "@mysticatea/node/no-missing-import": "off",
                "@mysticatea/vue/html-closing-bracket-newline": "off",
                "@mysticatea/vue/max-attributes-per-line": "off",
                "@mysticatea/vue/comma-dangle": "off",
                "@mysticatea/vue/html-indent": "off",
                "@mysticatea/vue/html-self-closing": "off",
                "@mysticatea/node/file-extension-in-import": "off",
                "@mysticatea/node/no-unsupported-features/es-syntax": "off",
            },
        },
    ],
};
