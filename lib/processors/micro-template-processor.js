"use strict"

const container = require("../shared-container")

const DISABLED_RULES = [
    "indent",
    "indent-legacy",
    "strict",
    "no-empty",
    "max-statements-per-line",
    "padded-blocks",
    "no-implicit-globals",
    "no-multi-spaces",
]

const TEMPLATE_DISABLED_RULES = ["no-irregular-whitespace"]

const TMPL_DELIMITERS_DISABLED_RULES = ["semi-spacing", "semi", "no-extra-semi"]

const TMPL_INTERPOLATE_DISABLED_RULES = ["no-unused-expressions"]

const GLOBALS = ["print"]

/**
 * postprocess for Filter disable rules messages.
 * @param {Array} messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForDisableRules(messages, microTemplateService) {
    const option = microTemplateService.systemOption || {}
    const ignoreRules = DISABLED_RULES.concat(option.ignoreRules || [])
    const globals = GLOBALS.concat(option.globals || [])

    return messages.filter(message => {
        if (ignoreRules.indexOf(message.ruleId) >= 0) {
            return false
        }
        if (
            microTemplateService.inTemplate(message) &&
            TEMPLATE_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }
        if (
            microTemplateService.inInterpolateOrEscape(message) &&
            TMPL_INTERPOLATE_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }
        if (
            microTemplateService.inDelimiterMarks(message) &&
            TMPL_DELIMITERS_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }

        if (message.ruleId === "no-undef") {
            if (
                globals
                    .map(g => `'${g}' is not defined.`)
                    .indexOf(message.message) >= 0
            ) {
                return false
            }
        }
        if (message.ruleId === "quotes") {
            if (message.message === "Strings must use doublequote.") {
                return false
            }
        }

        return true
    })
}

module.exports = {
    preprocess(code, filename) {
        container.addParseTargetFile(filename)
        return [code]
    },

    postprocess(messages, filename) {
        const microTemplateService = container.getService(filename)
        container.unregisters(filename)
        if (!microTemplateService) {
            return messages[0]
        }
        return postprocessForDisableRules(messages[0], microTemplateService)
    },

    supportsAutofix: true,
}
