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
        "best-practices": require("./configs/best-practices"),
        recommended: require("./configs/recommended"),
        "recommended-with-html": require("./configs/recommended-with-html"),
        "recommended-with-script": require("./configs/recommended-with-script"),
        all: require("./configs/all"),
        "flat/base": require("./configs/flat/base"),
        "flat/base-with-ejs": require("./configs/flat/base-with-ejs"),
        "flat/best-practices": require("./configs/flat/best-practices"),
        "flat/recommended": require("./configs/flat/recommended"),
        "flat/recommended-with-html": require("./configs/flat/recommended-with-html"),
        "flat/recommended-with-script": require("./configs/flat/recommended-with-script"),
        "flat/all": require("./configs/flat/all"),
    },
    rules,
    processors,
    parser,
};
