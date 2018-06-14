"use strict"

const container = require("./shared-container")
const processor = require("./processor/micro-template-processor")

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
        return this.targetExtensions.reduce((obj, ext) => {
            obj[ext] = processor
            return obj
        }, {})
    },
    get targetExtensions() {
        return [].concat(container.targetExtensions)
    },
    setTargetExtensions(exts) {
        container.targetExtensions = Array.isArray(exts)
            ? [].concat(exts)
            : [exts]
    },
    addTargetExtensions(exts) {
        this.setTargetExtensions(
            this.targetExtensions.concat(Array.isArray(exts) ? exts : [exts])
        )
    },
}
