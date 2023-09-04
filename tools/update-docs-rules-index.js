"use strict";

const fs = require("fs");
const path = require("path");
const rules = require("../lib/utils/rules").rules;
const categories = require("./lib/categories");

// -----------------------------------------------------------------------------
const uncategorizedRules = rules.filter(
    (rule) => !rule.meta.docs.category && !rule.meta.deprecated,
);
const deprecatedRules = rules.filter((rule) => rule.meta.deprecated);

//eslint-disable-next-line require-jsdoc -- ignore
function toRuleRow(rule) {
    const mark = `${rule.meta.fixable ? ":wrench:" : ""}${
        rule.meta.deprecated ? ":warning:" : ""
    }`;
    const link = `[${rule.meta.docs.ruleId}](./${rule.meta.docs.ruleName}.md)`;
    const description = rule.meta.docs.description || "(no description)";

    return `| ${link} | ${description} | ${mark} |`;
}

//eslint-disable-next-line require-jsdoc -- ignore
function toDeprecatedRuleRow(rule) {
    const link = `[${rule.meta.docs.ruleId}](./${rule.meta.docs.ruleName}.md)`;
    const replacedRules = rule.meta.docs.replacedBy || [];
    const replacedBy = replacedRules
        .map((name) => `[lodash-template/${name}](./${name}.md)`)
        .join(", ");

    return `| ${link} | ${replacedBy || "(no replacement)"} |`;
}

// -----------------------------------------------------------------------------
let rulesTableContent = categories
    .map(
        (category) =>
            `
## ${category.title}

${category.configDescription}

\`\`\`json
{
  "extends": "plugin:lodash-template/${category.categoryId}"
}
\`\`\`
${
    category.rules.length
        ? `
| Rule ID | Description |    |
|:--------|:------------|:---|
${category.rules.map(toRuleRow).join("\n")}
`
        : ""
}`,
    )
    .join("");

// -----------------------------------------------------------------------------
if (uncategorizedRules.length >= 1) {
    rulesTableContent += `
## Uncategorized

No preset enables the rules in this category.
Please enable each rule if you want.

For example:

\`\`\`json
{
  "rules": {
    "${uncategorizedRules[0].meta.docs.ruleId}": "error"
  }
}
\`\`\`

| Rule ID | Description |    |
|:--------|:------------|:---|
${uncategorizedRules.map(toRuleRow).join("\n")}
`;
}

// -----------------------------------------------------------------------------
if (deprecatedRules.length >= 1) {
    rulesTableContent += `
## Deprecated

- :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
- :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${deprecatedRules.map(toDeprecatedRuleRow).join("\n")}
`;
}

// -----------------------------------------------------------------------------
const readmeFilePath = path.resolve(__dirname, "../docs/rules/README.md");
fs.writeFileSync(
    readmeFilePath,
    `---
sidebarDepth: 0
---

# All Rules

<!-- This file is automatically generated in tools/update-docs-rules-index.js, do not change! -->
${rulesTableContent}`,
);
