"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {
    },
    extends: [
        "eslint:all",
        "plugin:local/test",
    ],
    rules: {
        "local/plugin-option": [2, {
            ignoreRules: ["no-tabs"],
            globals: ["name"],
        }],
    },
    globals: {
        _: true,
    },
}
