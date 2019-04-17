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

//eslint-disable-next-line require-jsdoc
function yamlValue(val) {
    if (typeof val === "string") {
        return `"${val.replace(/"/gu, '\\"')}"`
    }
    return val
}

const ROOT = path.resolve(__dirname, "../docs/rules")

class DocFile {
    constructor(rule) {
        this.rule = rule
        this.filePath = path.join(ROOT, `${rule.meta.docs.ruleName}.md`)
        this.content = fs.readFileSync(this.filePath, "utf8")
    }

    static read(rule) {
        return new DocFile(rule)
    }

    updateHeader() {
        const {
            meta: {
                fixable,
                deprecated,
                docs: { ruleId, description, category, replacedBy },
            },
        } = this.rule
        const title = `# ${ruleId}\n> ${description}`
        const notes = []

        if (deprecated) {
            if (replacedBy) {
                const replacedRules = replacedBy.map(
                    name => `[vue/${name}](${name}.md) rule`
                )
                notes.push(
                    `- :warning: This rule was **deprecated** and replaced by ${formatItems(
                        replacedRules
                    )}.`
                )
            } else {
                notes.push(`- :warning: This rule was **deprecated**.`)
            }
        } else {
            const presets = Array.from(
                new Set(
                    getPresets(category).concat(["plugin:lodash-template/all"])
                )
            )

            if (presets.length) {
                notes.push(
                    `- :gear: This rule is included in ${formatItems(
                        presets.map(c => `\`"${c}"\``)
                    )}.`
                )
            }
            // const presets = categories
            //     .slice(categoryIndex)
            //     .map(category => `\`"plugin:vue/${category.categoryId}"\``)
            // notes.push(
            //     `- :gear: This rule is included in ${formatItems(presets)}.`
            // )
        }
        if (fixable) {
            notes.push(
                `- :wrench: The \`--fix\` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.`
            )
        }

        // Add an empty line after notes.
        if (notes.length >= 1) {
            notes.push("", "")
        }

        const headerPattern = /#.+\n[^\n]*\n+(?:- .+\n)*\n*/u
        const header = `${title}\n\n${notes.join("\n")}`
        if (headerPattern.test(this.content)) {
            this.content = this.content.replace(headerPattern, header)
        } else {
            this.content = `${header}${this.content.trim()}\n`
        }

        return this
    }

    updateFooter() {
        const { ruleName } = this.rule.meta.docs
        const footerPattern = /## Implementation[\s\S]+$/u
        const footer = `## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/${ruleName}.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/${ruleName}.js)
`
        if (footerPattern.test(this.content)) {
            this.content = this.content.replace(footerPattern, footer)
        } else {
            this.content = `${this.content.trim()}\n\n${footer}`
        }

        return this
    }

    updateCodeBlocks() {
        const { meta } = this.rule

        this.content = this.content.replace(
            /<eslint-code-block\s(:?fix[^\s]*)?\s*/gu,
            `<eslint-code-block ${meta.fixable ? "fix " : ""}`
        )
        return this
    }

    adjustCodeBlocks() {
        // Adjust the necessary blank lines before and after the code block so that GitHub can recognize `.md`.
        this.content = this.content.replace(
            /(<eslint-code-block([\s\S]*?)>)\n+```/gmu,
            "$1\n\n```"
        )
        this.content = this.content.replace(
            /```\n+<\/eslint-code-block>/gmu,
            "```\n\n</eslint-code-block>"
        )
        return this
    }

    updateFileIntro() {
        const { ruleId, description } = this.rule.meta.docs

        const fileIntro = {
            pageClass: "rule-details",
            sidebarDepth: 0,
            title: ruleId,
            description,
        }
        const computed = `---\n${Object.keys(fileIntro)
            .map(key => `${key}: ${yamlValue(fileIntro[key])}`)
            .join("\n")}\n---\n`

        const fileIntroPattern = /^---\n(.*\n)+---\n*/gu

        if (fileIntroPattern.test(this.content)) {
            this.content = this.content.replace(fileIntroPattern, computed)
        } else {
            this.content = `${computed}${this.content.trim()}\n`
        }

        return this
    }

    write() {
        const isWin = require("os")
            .platform()
            .startsWith("win")

        this.content = this.content.replace(/\r?\n/gu, isWin ? "\r\n" : "\n")

        fs.writeFileSync(this.filePath, this.content)
    }
}

for (const rule of rules) {
    DocFile.read(rule)
        .updateHeader()
        .updateFooter()
        .updateCodeBlocks()
        .updateFileIntro()
        .adjustCodeBlocks()
        .write()
}
