"use strict"

const sharedContainer = require("../shared-container")

/**
 * Check whether the code is a HTML.
 * @param {string} filePath The filePath.
 * @returns {boolean} `true` if the source code is a HTML.
 */
function isHtmlFile(filePath) {
    const fp = typeof filePath === "string" ? filePath : "unknown.js"
    const container = sharedContainer.get(fp)
    if (container && container.isHtml(fp)) {
        return true
    }
    if (fp.toLowerCase().endsWith(".html")) {
        return true
    }
    return false
}

module.exports = {
    isHtmlFile,
}
