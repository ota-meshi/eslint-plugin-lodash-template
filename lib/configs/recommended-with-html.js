"use strict";

const util = require("../utils/rules");

const recommended = require("./recommended");
module.exports = {
    ...recommended,
    rules: {
        ...recommended.rules,
        ...util.collectRules("recommended-with-html"),
    },
    processor: "lodash-template/html",
};
