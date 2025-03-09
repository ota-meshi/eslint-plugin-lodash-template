"use strict";

const util = require("../utils/rules");

const recommended = require("./recommended");
const processors = require("../processors");

module.exports = {
    ...recommended,
    rules: {
        ...recommended.rules,
        ...util.collectRules("recommended-with-html"),
    },
    processor: processors.html,
};
