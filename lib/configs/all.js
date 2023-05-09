"use strict";

const util = require("../utils/rules");

module.exports = {
    extends: require.resolve("./base"),
    rules: util.collectRules(),
};
