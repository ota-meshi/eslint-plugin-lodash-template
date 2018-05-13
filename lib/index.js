"use strict"

const rules = require("./utils/rules").rules.reduce((obj, r) => {
    obj[r.meta.docs.ruleName] = r
    return obj
}, {})

const config = {
    configs: {
        base: require("./configs/base"),
        "best-practices": require("./configs/best-practices"),
        recommended: require("./configs/recommended"),
        all: require("./configs/all"),
    },
    rules,
    processors: {
        ".html": require("./processor/micro-template-processor"),
    },
}
module.exports = config
