"use strict";

const path = require("path");
const fs = require("fs");

/**
 * Get the all rules
 * @returns {Array} The all rules
 */
function readRules() {
    const rulesRoot = path.resolve(__dirname, "../../lib/rules");
    const result = fs.readdirSync(rulesRoot);
    const rules = [];
    for (const name of result) {
        const ruleName = name.replace(/\.js$/u, "");
        const ruleId = `lodash-template/${ruleName}`;

        const rule = require(path.join(rulesRoot, name));
        rule.meta.docs.ruleId = ruleId;
        rule.meta.docs.ruleName = ruleName;
        rules.push(rule);
    }
    return rules;
}

const rules = readRules();

module.exports = rules;
