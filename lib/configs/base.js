"use strict"

const util = require("../utils/rules")

module.exports = {
    parser: require.resolve("../parser/micro-template-eslint-parser"),
    plugins: ["lodash-template"],
    rules: util.collectRules("base"),
    overrides: [
        {
            files: ["*.ejs"],
            parserOptions: {
                templateSettings: {
                    evaluate: [["<%", "<%_"], ["%>", "-%>", "_%>"]],
                    interpolate: ["<%-", ["%>", "-%>", "_%>"]],
                    escape: ["<%=", ["%>", "-%>", "_%>"]],
                    comment: ["<%#", "%>"],
                    literal: ["<%%"],
                },
            },
        },
    ],
}
