"use strict"

const fs = require("fs")
const path = require("path")
const rules = require("../lib/utils/rules").rules
const categories = require("./lib/categories")

const uncategorizedRules = rules.filter(
    rule => !rule.meta.docs.category && !rule.meta.deprecated
)
const deprecatedRules = rules.filter(rule => rule.meta.deprecated)

//eslint-disable-next-line require-jsdoc
function toRuleRow(rule) {
    const mark = `${rule.meta.fixable ? ":wrench:" : ""}${
        rule.meta.deprecated ? ":warning:" : ""
    }`
    const link = `[${rule.meta.docs.ruleId}](./docs/rules/${
        rule.meta.docs.ruleName
    }.md)`
    const description = rule.meta.docs.description || "(no description)"

    return `| ${mark} | ${link} | ${description} |`
}

//eslint-disable-next-line require-jsdoc
function toDeprecatedRuleRow(rule) {
    const link = `[${rule.meta.docs.ruleId}](./docs/rules/${
        rule.meta.docs.ruleName
    }.md)`
    const replacedRules = rule.meta.docs.replacedBy || []
    const replacedBy = replacedRules
        .map(name => `[lodash-template/${name}](./docs/rules/${name}.md)`)
        .join(", ")

    return `| ${link} | ${replacedBy || "(no replacement)"} |`
}

let rulesTableContent = categories
    .map(
        category => `
### ${category.title}

Enforce all the rules in this category and all of the above rules with:

\`\`\`json
{
  "extends": "plugin:lodash-template/${category.categoryId}"
}
\`\`\`

|    | Rule ID | Description |
|:---|:--------|:------------|
${category.rules.map(toRuleRow).join("\n")}
`
    )
    .join("")

if (uncategorizedRules.length >= 1) {
    rulesTableContent += `
### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
${uncategorizedRules.map(toRuleRow).join("\n")}
`
}

if (deprecatedRules.length >= 1) {
    rulesTableContent += `
### Deprecated

> - :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
> - :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${deprecatedRules.map(toDeprecatedRuleRow).join("\n")}
`
}

const readmeFilePath = path.resolve(__dirname, "../README.md")
fs.writeFileSync(
    readmeFilePath,
    fs
        .readFileSync(readmeFilePath, "utf8")
        .replace(
            /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/,
            `<!--RULES_TABLE_START-->\n${rulesTableContent}\n<!--RULES_TABLE_END-->`
        )
)
