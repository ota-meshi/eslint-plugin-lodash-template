"use strict";

const util = require("../utils/rules");

module.exports = {
    extends: require.resolve("./recommended"),
    rules: util.collectRules("recommended-with-html"),
};
