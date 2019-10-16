"use strict"

const crypto = require("crypto")

module.exports = hash

/**
 * Create hash
 * @param {string} data plain text
 */
function hash(data) {
    return crypto
        .createHash("md4")
        .update(data)
        .digest("hex")
}
