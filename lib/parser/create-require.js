"use strict";

const Module = require("module");
const path = require("path");
module.exports = {
    createRequire:
        // Added in v12.2.0

        Module.createRequire ||
        // Added in v10.12.0, but deprecated in v12.2.0.
        // eslint-disable-next-line n/no-deprecated-api -- ignore
        Module.createRequireFromPath ||
        // Polyfill - This is not executed on the tests on node@>=10.
        /* istanbul ignore next */
        ((filename) => {
            const mod = new Module(filename);

            mod.filename = filename;
            mod.paths = Module._nodeModulePaths(path.dirname(filename));
            mod._compile("module.exports = require;", filename);
            return mod.exports;
        }),
};
