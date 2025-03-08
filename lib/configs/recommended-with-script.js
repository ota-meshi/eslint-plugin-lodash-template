"use strict";

const recommended = require("./recommended");
module.exports = {
    ...recommended,
    processor: "lodash-template/script",
};
