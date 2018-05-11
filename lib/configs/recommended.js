"use strict"

const util = require("../utils/rules")

module.exports = {
    extends: require.resolve("./best-practices"),
    rules: util.collectRules("recommended"),
}
