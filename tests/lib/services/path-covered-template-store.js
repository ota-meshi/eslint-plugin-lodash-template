"use strict"

const assert = require("assert")
const path = require("path")
const fs = require("fs")
const parser = require("../../../lib/parser/micro-template-eslint-parser")
const PathCoveredTemplateStore = require("../../../lib/services/path-covered-template-store")
const visitorKeys = require("eslint-visitor-keys").KEYS
const testUtils = require("../../test-utils")

const FIXTURE_DIR = path.join(
    __dirname,
    "../../../tests_fixtures/path-covered-template"
)

/**
 * getPathCoveredTemplateStore
 * @param {string} fileName file name
 */
function getPathCoveredTemplateStore(fileName) {
    const filePath = path.join(FIXTURE_DIR, fileName)
    const code = fs.readFileSync(filePath, "utf8")
    const result = parser.parseTemplate(code, { filePath })
    const microTemplate = result.services.getMicroTemplateService()

    const templates = new PathCoveredTemplateStore(
        result.ast,
        result.visitorKeys || visitorKeys,
        microTemplate.template
    )
    return {
        templates,
        code,
        getLocFromIndex: (index) => microTemplate.getLocFromIndex(index),
    }
}

describe("PathCoveredTemplateStore test", () => {
    for (const name of fs
        .readdirSync(FIXTURE_DIR)
        .filter((s) => s.endsWith(".html"))) {
        describe("Extracted texts should be valid.", () => {
            it(name, () => {
                const {
                    templates,
                    code,
                    getLocFromIndex,
                } = getPathCoveredTemplateStore(name)

                const texts = []
                for (let index = 0; index < code.length; index++) {
                    const { template } = templates.getPathCoveredTemplate(index)
                    if (!texts.includes(template)) {
                        const loc = getLocFromIndex(index)
                        texts.push(
                            `--------(index:${index},line:${loc.line},col:${loc.column})--------`
                        )
                        texts.push(template)
                    }
                }

                const expectFilepath = path.join(
                    FIXTURE_DIR,
                    name.replace(/\.html$/u, ".txt")
                )
                try {
                    assert.strictEqual(
                        texts.join("\n"),
                        fs.readFileSync(expectFilepath, "utf8")
                    )
                } catch (e) {
                    testUtils.writeFile(expectFilepath, texts.join("\n"))
                    throw e
                }
            })
        })
    }
})
