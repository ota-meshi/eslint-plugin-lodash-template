"use strict";

const assert = require("assert");
const container = require("../../../lib/shared-container");

describe("shared-container", () => {
    it("empty", () => {
        const c = container.get("shared-container_test.html");
        assert.strictEqual(c, null);
    });
    it("add service", () => {
        let c = container.register("shared-container_test.html");
        c.setService("1");
        c.setService("2");
        assert.strictEqual(c.getService("shared-container_test.html"), "2");
        container.unregister("shared-container_test.html");
        c = container.get("shared-container_test.html");
        assert.strictEqual(c, null);
    });
});
