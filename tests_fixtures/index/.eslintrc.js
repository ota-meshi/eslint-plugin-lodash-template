"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {},
    extends: ["eslint:all", "plugin:lodash-template/all"],
    rules: {
        "linebreak-style": "off",
        "max-len": "off",
        "lodash-template/html-indent": "off",
    },
    globals: {
        _: true,
    },
    "settings": {
        "lodash-template/ignoreRules": ["no-tabs"],
        "lodash-template/globals": ["name"],
    }
}
