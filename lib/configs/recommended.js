"use strict";

const util = require("../utils/rules");

const bestPractices = require("./best-practices");
module.exports = {
    ...bestPractices,
    rules: {
        ...bestPractices.rules,
        ...util.collectRules("recommended"),
    },
};
