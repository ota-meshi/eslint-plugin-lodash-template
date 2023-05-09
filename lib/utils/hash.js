"use strict";

const crypto = require("crypto");

module.exports = hash;

/**
 * Create hash
 * @param {string} data plain text
 */
function hash(data) {
    return crypto.createHash("md5").update(data, "utf8").digest("hex");
}
