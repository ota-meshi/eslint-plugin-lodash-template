"use strict"

const container = require("../shared-container")

const DISABLED_RULES = [
    "indent",
    "strict",
    "no-empty",
    "max-statements-per-line",
    "padded-blocks",
    "no-implicit-globals",
]

const TEMPLATE_DISABLED_RULES = ["indent"]

const TMPL_DELIMITERS_DISABLED_RULES = ["semi-spacing", "semi"]

const TMPL_INTERPOLATE_DISABLED_RULES = [
    "no-unused-expressions",
    "no-multi-spaces",
]

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
        if (
            microTemplateService.messageWithinTemplate(message) &&
            TEMPLATE_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }
        if (
            microTemplateService.messageWithinInterpolateOrEscape(message) &&
            TMPL_INTERPOLATE_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }
        if (
            microTemplateService.messageWithinDelimiterMarks(message) &&
            TMPL_DELIMITERS_DISABLED_RULES.indexOf(message.ruleId) >= 0
        ) {
            return false
        }

        if (ignoreRules.indexOf(message.ruleId) >= 0) {
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

/**
 * postprocess for comment-directive
 * @param {Array} messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForCommentDirective(messages, microTemplateService) {
    // Filter messages which are in disabled area.
    return messages.filter(
        message => !microTemplateService.isDisableMessage(message)
    )
}

module.exports = {
    preprocess(code) {
        return [code]
    },

    postprocess(messages, fileName) {
        const microTemplateService = container.popService(fileName)
        if (!microTemplateService) {
            return messages
        }
        let resultMessages = postprocessForCommentDirective(
            messages[0],
            microTemplateService
        )
        resultMessages = postprocessForDisableRules(
            resultMessages,
            microTemplateService
        )
        return resultMessages
    },

    supportsAutofix: true,
}
