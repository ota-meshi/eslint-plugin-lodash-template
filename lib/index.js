"use strict"

const processors = require("./processors")

const rules = require("./utils/rules").rules.reduce((obj, r) => {
    obj[r.meta.docs.ruleName] = r
    return obj
}, {})

module.exports = {
    configs: {
        base: require("./configs/base"),
        "best-practices": require("./configs/best-practices"),
        recommended: require("./configs/recommended"),
        "recommended-with-html": require("./configs/recommended-with-html"),
        "recommended-with-js": require("./configs/recommended-with-js"),
        all: require("./configs/all"),
    },
    rules,
    processors,
}
