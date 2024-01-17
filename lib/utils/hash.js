"use strict";

module.exports = hash;

/**
 * Create hash
 * @param {string} data plain text
 */
function hash(data) {
    return require("crypto")
        .createHash("md5")
        .update(data, "utf8")
        .digest("hex");
}
