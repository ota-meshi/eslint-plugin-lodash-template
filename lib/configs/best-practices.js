"use strict";

const util = require("../utils/rules");

const base = require("./base");
module.exports = {
    ...base,
    rules: {
        ...base.rules,
        ...util.collectRules("best-practices"),
    },
};
