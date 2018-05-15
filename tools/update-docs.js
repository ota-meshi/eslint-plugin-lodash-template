"use strict"

const fs = require("fs")
const path = require("path")
const rules = require("../lib/utils/rules").rules
const categories = require("./lib/categories")

//eslint-disable-next-line require-jsdoc
function formatItems(items) {
    if (items.length <= 2) {
        return items.join(" and ")
    }
    return `all of ${items.slice(0, -1).join(", ")} and ${
        items[items.length - 1]
    }`
}

const ROOT = path.resolve(__dirname, "../docs/rules")
for (const rule of rules) {
    const filePath = path.join(ROOT, `${rule.meta.docs.ruleName}.md`)
    const categoryIndex = categories.findIndex(
        category => category.categoryId === rule.meta.docs.category
    )
    const title = `# ${rule.meta.docs.description} (${rule.meta.docs.ruleId})`
    const notes = []

    if (categoryIndex >= 0) {
        const presets = categories
            .slice(categoryIndex)
            .map(
                category =>
                    `\`"plugin:lodash-template/${category.categoryId}"\``
            )
        notes.push(`- :gear: This rule is included in ${formatItems(presets)}.`)
    }
    if (rule.meta.deprecated) {
        if (rule.meta.docs.replacedBy) {
            const replacedRules = rule.meta.docs.replacedBy.map(
                name => `[lodash-template/${name}](${name}.md) rule`
            )
            notes.push(
                `- :warning: This rule was **deprecated** and replaced by ${formatItems(
                    replacedRules
                )}.`
            )
        } else {
            notes.push(`- :warning: This rule was **deprecated**.`)
        }
    }
    if (rule.meta.fixable) {
        notes.push(
            `- :wrench: The \`--fix\` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.`
        )
    }

    // Add an empty line after notes.
    if (notes.length >= 1) {
        notes.push("", "")
    }

    const isWin = require("os")
        .platform()
        .startsWith("win")
    fs.writeFileSync(
        filePath,
        fs
            .readFileSync(filePath, "utf8")
            .replace(
                /^#[^\n]*(\r?\n)+(?:- .+\r?\n)*(\r?\n)*/,
                `${title}${isWin ? "\r\n\r\n" : "\n\n"}${notes.join(
                    isWin ? "\r\n" : "\n"
                )}`
            )
    )
}
