"use strict"

const container = require("./shared-container")

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
        all: require("./configs/all"),
    },
    rules,
    get processors() {
        return container.targetExtensions.reduce((obj, ext) => {
            obj[ext] = require("./processor/micro-template-processor")
            return obj
        }, {})
    },
    get targetExtensions() {
        return [].const(container.targetExtensions)
    },
    setTargetExtensions(exts) {
        container.targetExtensions = Array.isArray(exts)
            ? [].concat(exts)
            : [exts]
    },
    addTargetExtensions(exts) {
        for (const ext of Array.isArray(exts) ? exts : [exts]) {
            container.targetExtensions.push(ext)
        }
    },
}
