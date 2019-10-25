"use strict"

const getLinters = require("../../utils/get-linters")

let curConfig = null
let alternativeCLIEngine = null

for (const Linter of getLinters()) {
    const verifyBase = Linter.prototype.verify
    const verifyAndFixBase = Linter.prototype.verifyAndFix
    Object.defineProperty(Linter.prototype, "verify", {
        // eslint-disable-next-line no-loop-func
        value: function verify(textOrSourceCode, config, ...args) {
            curConfig = config
            const result = verifyBase.call(
                this,
                textOrSourceCode,
                config,
                ...args
            )
            curConfig = null
            return result
        },
        configurable: true,
        writable: true,
    })
    Object.defineProperty(Linter.prototype, "verifyAndFix", {
        // eslint-disable-next-line no-loop-func
        value: function verifyAndFix(textOrSourceCode, config, ...args) {
            curConfig = config
            const result = verifyAndFixBase.call(
                this,
                textOrSourceCode,
                config,
                ...args
            )
            curConfig = null
            return result
        },
        configurable: true,
        writable: true,
    })
}

module.exports = filename => {
    if (curConfig) {
        if (typeof curConfig.extractConfig === "function") {
            return curConfig.extractConfig(filename)
        }
        return curConfig
    }
    const eslint = require("eslint")
    try {
        if (!alternativeCLIEngine) {
            alternativeCLIEngine = new eslint.CLIEngine({})
        }
        const config = alternativeCLIEngine.getConfigForFile(filename)
        return Object.assign({ filePath: filename }, config)
    } catch (_) {
        // ignore
    }
    return {}
}
