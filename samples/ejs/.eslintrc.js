"use strict"

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {},
    extends: [
        "eslint:all", 
        "plugin:lodash-template/all"
    ],
    "overrides": [
        {
            "files": ["*.ejs"],
            "processor": "lodash-template/base"
        }
    ]
}
