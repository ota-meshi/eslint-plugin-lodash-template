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

    // Resolve the array of configs, relative to the filename and produce a single config object
    // It is prone to errors, but this is our best effort to resolve the config
    let finalConfig = {};

    for (const configItem of curConfig) {
        // Skip if the config doesn't apply to this file
        if (configItem.files && !matchesFiles(filename, configItem.files)) {
            continue;
        }

        // Skip if the file is explicitly ignored
        if (configItem.ignores && matchesFiles(filename, configItem.ignores)) {
            continue;
        }

        // Merge in the current config rules and settings
        if (configItem.rules) {
            finalConfig.rules = {
                ...(finalConfig.rules || {}),
                ...configItem.rules,
            };
        }

        if (configItem.settings) {
            finalConfig.settings = {
                ...(finalConfig.settings || {}),
                ...configItem.settings,
            };
        }

        // Merge other relevant properties
        [
            "parserOptions",
            "parser",
            "plugins",
            "languageOptions",
            "processor",
        ].forEach((prop) => {
            if (configItem[prop]) {
                finalConfig[prop] = configItem[prop];
            }
        });
    }

    return finalConfig;
};

const { minimatch } = require("minimatch");
/**
 * Checks if a file matches the given patterns
 * @param {string} filename - The filename to check
 * @param {string|string[]} patterns - Glob pattern or array of patterns
 * @returns {boolean} - Whether the filename matches any of the patterns
 */
function matchesFiles(filename, patterns) {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    return patternArray.some((pattern) => minimatch(filename, pattern));
}
