"use strict"

const fs = require("fs")
const path = require("path")
const rules = require("../lib/utils/rules").rules
const configs = require("./lib/load-configs")

//eslint-disable-next-line require-jsdoc
function formatItems(items) {
    if (items.length <= 2) {
        return items.join(" and ")
    }
    return `all of ${items.slice(0, -1).join(", ")} and ${
        items[items.length - 1]
    }`
}

//eslint-disable-next-line require-jsdoc
function getPresets(category) {
    const categoryConfig = configs.find(conf => conf.name === category)
    if (!categoryConfig) {
        return []
    }

    const presets = [categoryConfig.configId]
    const subTargets = configs.filter(conf =>
        conf.extends.find(ext => ext.name === category)
    )
    for (const sub of subTargets) {
        for (const name of getPresets(sub.name)) {
            presets.push(name)
        }
    }
    return presets
}

const ROOT = path.resolve(__dirname, "../docs/rules")
for (const rule of rules) {
    const filePath = path.join(ROOT, `${rule.meta.docs.ruleName}.md`)

    const presets = Array.from(
        new Set(
            getPresets(rule.meta.docs.category).concat([
                "plugin:lodash-template/all",
            ])
        )
    )
    const title = `# ${rule.meta.docs.description} (${rule.meta.docs.ruleId})`
    const notes = []

    if (presets.length) {
        notes.push(
            `- :gear: This rule is included in ${formatItems(
                presets.map(c => `\`"${c}"\``)
            )}.`
        )
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
            `- :wrench: The \`--fix\` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.`
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
                /^#[^\n]*(\r?\n)+(?:- .+\r?\n)*(\r?\n)*/u,
                `${title}${isWin ? "\r\n\r\n" : "\n\n"}${notes.join(
                    isWin ? "\r\n" : "\n"
                )}`
            )
    )
}
