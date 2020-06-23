"use strict"

const assert = require("assert")
const htmlParser = require("../../../lib/services/html-parser")
const SourceCodeStore = require("../../../lib/services/source-code-store")

/**
 * Parse html
 * @param {string} code source code
 */
function parse(code) {
    const store = new SourceCodeStore(code)
    return htmlParser(code, store)
}

describe("html-parser test", () => {
    it("prefixed attributes", () => {
        // https://github.com/ota-meshi/eslint-plugin-lodash-template/issues/136
        const ast = parse('<svg xml:space="preserve"></svg>')
        assert.strictEqual(ast.type, "HTMLDocumentFragment")
        assert.strictEqual(ast.children.length, 1)
        assert.strictEqual(ast.children[0].type, "HTMLElement")
        assert.strictEqual(ast.children[0].name, "svg")
        assert.strictEqual(ast.children[0].startTag.attributes.length, 1)
        assert.deepStrictEqual(ast.children[0].startTag.attributes[0].range, [
            5,
            25,
        ])
        assert.strictEqual(
            ast.children[0].startTag.attributes[0].key,
            "xml:space"
        )
        assert.strictEqual(
            ast.children[0].startTag.attributes[0].value,
            "preserve"
        )
    })
})
