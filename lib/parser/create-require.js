"use strict"

const Module = require("module")
const path = require("path")
module.exports = {
    createRequire:
        // Added in v12.2.0
        // eslint-disable-next-line node/no-unsupported-features/node-builtins -- ignore
        Module.createRequire ||
        // Added in v10.12.0, but deprecated in v12.2.0.
        // eslint-disable-next-line node/no-deprecated-api, node/no-unsupported-features/node-builtins -- ignore
        Module.createRequireFromPath ||
        // Polyfill - This is not executed on the tests on node@>=10.
        /* istanbul ignore next */
        ((modname) => {
            const mod = new Module(modname)

            mod.filename = modname
            mod.paths = Module._nodeModulePaths(path.dirname(modname))
            mod._compile("module.exports = require;", modname)
            return mod.exports
        }),
}