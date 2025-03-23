"use strict";

const recommended = require("./recommended");
const processors = require("../processors");

module.exports = {
    ...recommended,
    processor: processors.script,
};
