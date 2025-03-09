"use strict";

const processors = require("./processors");
const parser = require("./parser/micro-template-eslint-parser");

const rules = require("./utils/rules").rules.reduce((obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
}, {});

module.exports = {
    meta: require("./meta"),
    configs: {
        base: require("./configs/base"),
        baseWithEjs: require("./configs/base-with-ejs"),
        bestPractices: require("./configs/best-practices"),
        recommended: require("./configs/recommended"),
        recommendedWithHtml: require("./configs/recommended-with-html"),
        recommendedWithScript: require("./configs/recommended-with-script"),
        all: require("./configs/all"),
    },
    rules,
    processors,
    parser,
};
