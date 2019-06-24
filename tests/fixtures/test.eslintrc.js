"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {},
    extends: ["eslint:all", "plugin:lodash-template/all"],
    rules: {
        "lodash-template/plugin-option": [
            "error",
            {
                ignoreRules: ["no-tabs"],
                globals: ["name"],
            },
        ],
        "linebreak-style": "off",
        "max-len": "off",
        "lodash-template/html-indent": "off",
    },
    globals: {
        _: true,
    },
}
