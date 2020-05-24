// @ts-check
"use strict"

const sharedContainer = require("../shared-container")
const getConfig = require("./utils/get-config")

/**
 * @typedef {import('../services/micro-template-service')} MicroTemplateService
 */

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

const TMPL_DELIMITERS_DISABLED_RULES = [
    "semi-spacing",
    "semi",
    "no-extra-semi",
    "semi-style",
]

const TMPL_INTERPOLATE_DISABLED_RULES = ["no-unused-expressions"]

const GLOBALS = ["print"]

/**
 * Get the settings
 * @param {string} filename
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 */
function getConfigSettingsOptions(filename, microTemplateService) {
    let ignoreRules = undefined
    let globals = undefined

    const config = getConfig(filename)
    if (config.settings) {
        ignoreRules = config.settings["lodash-template/ignoreRules"]
        globals = config.settings["lodash-template/globals"]
    }

    return Object.assign(
        {},
        // TODO Deprecated in 0.14.x
        microTemplateService.systemOption,
        {
            ignoreRules,
            globals,
        }
    )
}

/**
 * postprocess for Filter disable rules messages.
 * @param {string} filename The filename.
 * @param {Array} messages The base messages.
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForDisableRules(filename, messages, microTemplateService) {
    const option = getConfigSettingsOptions(filename, microTemplateService)
    const ignoreRules = DISABLED_RULES.concat(option.ignoreRules || [])
    const globals = GLOBALS.concat(option.globals || [])

    return messages.filter((message) => {
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
                    .map((g) => `'${g}' is not defined.`)
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
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForEjsCommentDirective(messages, microTemplateService) {
    // Filter messages which are in disabled area.
    return messages.filter(
        (message) => !microTemplateService.isDisableMessageForEjs(message)
    )
}

module.exports = {
    preprocess(code, filename) {
        sharedContainer.register(filename).parseTarget()
        return [code]
    },

    postprocess(messages, filename) {
        const container = sharedContainer.get(filename)
        const microTemplateService = container && container.getService(filename)

        sharedContainer.unregister(filename)
        if (!microTemplateService) {
            return [].concat(...messages)
        }

        const resultMessages = messages.map((m) =>
            postprocessForEjsCommentDirective(m, microTemplateService)
        )

        return postprocessForDisableRules(
            filename,
            [].concat(...resultMessages),
            microTemplateService
        )
    },

    supportsAutofix: true,
}
