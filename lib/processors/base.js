"use strict";

const microTemplateProcessor = require("./micro-template-processor");
const baseMeta = require("../meta");

module.exports = {
    ...microTemplateProcessor,
    meta: {
        name: `${baseMeta.name}/base`,
        version: baseMeta.version,
    },
};
