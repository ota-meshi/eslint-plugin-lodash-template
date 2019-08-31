"use strict"

const assert = require("assert")
const container = require("../lib/shared-container")

describe("shared-container", () => {
    it("empty", () => {
        assert.strictEqual(
            container.getService("shared-container_test.html"),
            null
        )
        assert.strictEqual(
            container.getService("shared-container_test.html"),
            null
        )
    })
    it("2 push", () => {
        container.addService("shared-container_test.html", "1")
        container.addService("shared-container_test.html", "2")
        assert.strictEqual(
            container.getService("shared-container_test.html"),
            "2"
        )
        container.unregisters("shared-container_test.html")
        assert.strictEqual(
            container.getService("shared-container_test.html"),
            "1"
        )
        container.unregisters("shared-container_test.html")
        assert.strictEqual(
            container.getService("shared-container_test.html"),
            null
        )
    })
})
