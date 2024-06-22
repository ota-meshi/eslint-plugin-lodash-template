"use strict";

const util = require("../../utils/rules");

module.exports = {
    ...require("./base"),
    rules: util.collectRules(),
};
