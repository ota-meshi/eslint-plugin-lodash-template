"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");

const htmlParser = require("../../../lib/services/html-parser");
const SourceCodeStore = require("../../../lib/services/source-code-store");
const testUtils = require("../../test-utils");

const FIXTURE_DIR = path.join(__dirname, "../../../tests_fixtures/html-parser");

/**
 * Parse html
 * @param {string} code source code
 */
function parse(code) {
    const store = new SourceCodeStore(code);
    return htmlParser(code, store);
}

describe("html-parser test", () => {
    for (const name of testUtils
        .listupFiles(FIXTURE_DIR)
        .filter((s) => s.endsWith(".html"))) {
        it(name, () => {
            const htmlFilepath = path.join(FIXTURE_DIR, name);
            const html = fs.readFileSync(htmlFilepath, "utf8");
            const ast = normalizeNode(parse(html));
            const expectFilepath = path.join(FIXTURE_DIR, `${name}.json`);
            try {
                assert.deepStrictEqual(
                    ast,
                    JSON.parse(fs.readFileSync(expectFilepath, "utf8")),
                );
            } catch (e) {
                testUtils.writeFile(
                    expectFilepath,
                    JSON.stringify(ast, null, 2),
                );
                throw e;
            }
        });
    }
});

/**
 * Gets the result of normalizing the given node.
 * @param {*} node
 */
function normalizeNode(node) {
    const result = {};
    for (const key of getKeys(node)) {
        if (
            key.startsWith("_") ||
            key.endsWith("_") ||
            key === "parent" ||
            key === "start" ||
            key === "end" ||
            key === "html" ||
            key === "sourceCodeStore" ||
            key === "htmlValue" ||
            key === "loc" ||
            key === "ignoredAttributes"
        ) {
            continue;
        }
        const value = node[key];
        if (typeof value === "function") {
            continue;
        }
        if (Array.isArray(value)) {
            result[key] = value.map((val) =>
                isNode(val) ? normalizeNode(val) : val,
            );
        } else if (isNode(value)) {
            result[key] = normalizeNode(value);
        } else {
            result[key] = value;
        }
    }
    return result;

    /**
     * Checks if the given object is a node
     * @param {*} obj
     */
    function isNode(obj) {
        return obj && typeof obj === "object" && typeof obj.type === "string";
    }

    /**
     * Get the all property keys from given object
     * @param {*} obj
     */
    function* getKeys(obj) {
        if (obj == null) {
            return;
        }
        yield* Object.getOwnPropertyNames(obj);
        yield* getKeys(Object.getPrototypeOf(obj));
    }
}
