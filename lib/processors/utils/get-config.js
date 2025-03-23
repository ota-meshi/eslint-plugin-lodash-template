"use strict";

const getLinters = require("../../utils/get-linters");

// It's not possible to access the config directly inside processors.
// So, we have to get the config some other way.
// ESLint.calculateConfigForFile is async, so we can't use it in processor methods,
// which are sync. As a result, we have to do all these hackery to get the config.
let curConfig = null;

for (const Linter of getLinters()) {
    const verifyBase = Linter.prototype.verify;
    const verifyAndFixBase = Linter.prototype.verifyAndFix;
    Object.defineProperty(Linter.prototype, "verify", {
        // eslint-disable-next-line no-loop-func -- ignore
        value: function verify(textOrSourceCode, config, options) {
            curConfig = config;
            const result = verifyBase.call(
                this,
                textOrSourceCode,
                config,
                options,
            );
            curConfig = null;
            return result;
        },
        configurable: true,
        writable: true,
    });
    Object.defineProperty(Linter.prototype, "verifyAndFix", {
        // eslint-disable-next-line no-loop-func -- ignore
        value: function verifyAndFix(textOrSourceCode, config, ...args) {
            curConfig = config;
            const result = verifyAndFixBase.call(
                this,
                textOrSourceCode,
                config,
                ...args,
            );
            curConfig = null;
            return result;
        },
        configurable: true,
        writable: true,
    });
}

module.exports = (filename) => {
    if (!curConfig) {
        return {};
    }

    if (!Array.isArray(curConfig)) {
        return curConfig;
    }

    // https://www.npmjs.com/package/@eslint/config-array
    if (typeof curConfig.getConfig === "function") {
        return curConfig.getConfig(filename);
    }

    return curConfig;
};
