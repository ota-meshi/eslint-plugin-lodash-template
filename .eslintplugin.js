"use strict"

const util = require("./lib/utils/rules")
const config = require("./")

const textConf = {
    parser: require.resolve("./lib/parser/micro-template-eslint-parser"),
    plugins: ["local"],
    rules: util.collectRules(),
}

for (const ruleName of Object.keys(textConf.rules)) {
    textConf.rules[ruleName.replace("lodash-template", "local")] =
        textConf.rules[ruleName]
    delete textConf.rules[ruleName]
}

config.configs.test = textConf

module.exports = config
