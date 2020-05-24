"use strict"

module.exports = {
    parserOptions: {
        sourceType: "script",
        parser: "babel-eslint",
        ecmaVersion: 2020,
    },
    extends: [
        "plugin:@mysticatea/es2015",
        "plugin:@mysticatea/+node",
        "plugin:@mysticatea/+eslint-plugin",
        "plugin:lodash-template/all",
    ],
    plugins: ["es"],
    rules: {
        "require-jsdoc": "error",
        "no-warning-comments": "warn",
    },
    overrides: [
        {
            files: ["lib/rules/**"],
            rules: {
                "@mysticatea/eslint-plugin/report-message-format": [
                    "error",
                    "[^a-z].*\\.$",
                ],
                "@mysticatea/eslint-plugin/require-meta-docs-url": [
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
            parserOptions: {
                parser: "vue-eslint-parser",
                sourceType: "module",
                ecmaVersion: 2018,
                parserOptions: {
                    parser: "babel-eslint",
                },
            },
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
}
