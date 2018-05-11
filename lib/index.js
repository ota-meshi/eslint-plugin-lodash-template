"use strict"

const path = require("path")
const fs = require("fs")
const rules = require("./utils/rules").rules.reduce((obj, r) => {
    obj[r.meta.docs.ruleName] = r
    return obj
}, {})

/**
 * Get the all configs
 * @returns {Array} The all configs
 */
function readConfigs() {
    const configsRoot = path.resolve(__dirname, "./configs")
    const result = fs.readdirSync(configsRoot)
    const configs = {}
    for (const name of result) {
        configs[name.replace(/\.js$/, "")] = require(path.join(
            configsRoot,
            name
        ))
    }
    return configs
}

const config = {
    configs: readConfigs(),
    rules,
    processors: {
        ".html": require("./processor/micro-template-processor"),
    },
}
module.exports = config
