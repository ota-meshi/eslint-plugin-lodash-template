"use strict";

const base = require("./base");
module.exports = {
    ...base,
    languageOptions: {
        ...base.languageOptions,
        parserOptions: {
            templateSettings: {
                evaluate: [
                    ["<%", "<%_"],
                    ["%>", "-%>", "_%>"],
                ],
                interpolate: ["<%-", ["%>", "-%>", "_%>"]],
                escape: ["<%=", ["%>", "-%>", "_%>"]],
                comment: ["<%#", ["%>", "-%>", "_%>"]],
                literal: ["<%%"],
            },
        },
    },
};
