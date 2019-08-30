"use strict"

const assert = require("assert")
const container = require("../lib/shared-container")

describe("shared-container", () => {
    it("empty", () => {
        assert.strictEqual(
            container.popService("shared-container_test.html"),
            null
        )
        assert.strictEqual(
            container.popService("shared-container_test.html"),
            null
        )
    })
    it("2 push", () => {
        container.pushService("shared-container_test.html", "1")
        container.pushService("shared-container_test.html", "2")
        assert.strictEqual(
            container.popService("shared-container_test.html"),
            "2"
        )
        assert.strictEqual(
            container.popService("shared-container_test.html"),
            "1"
        )
        assert.strictEqual(
            container.popService("shared-container_test.html"),
            null
        )
    })
})
