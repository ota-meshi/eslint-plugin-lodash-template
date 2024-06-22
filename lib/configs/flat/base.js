"use strict";

const util = require("../../utils/rules");

module.exports = {
    languageOptions: {
        parser: require("../../parser/micro-template-eslint-parser"),
    },
    plugins: {
        get "lodash-template"() {
            return require("../../index");
        },
    },
    rules: util.collectRules("base"),
};
