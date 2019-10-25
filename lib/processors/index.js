"use strict"

const base = require("./base")
const html = require("./html")
const script = require("./script")

module.exports = {
    base,
    html,
    ".html": html,
    script,
}
