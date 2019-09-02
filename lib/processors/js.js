"use strict"

const container = require("../shared-container")
const microTemplateProcessor = require("./micro-template-processor")
const parser = require("../parser/micro-template-eslint-parser")
const BranchedTemplateStore = require("../../lib/services/BranchedTemplateStore")
// eslint-disable-next-line @mysticatea/node/no-unpublished-require
const visitorKeys = require("eslint-visitor-keys").KEYS

let alternativeCLIEngine = null

const dummyFilename = `$eslint-plugin-lodash-template_dummyfile_${Date.now()}.js`

/**
 * Get the oarser congi
 * @param {string} filename
 */
function getParserConfig(filename) {
    const eslint = require("eslint")
    try {
        if (!alternativeCLIEngine) {
            alternativeCLIEngine = new eslint.CLIEngine({})
        }
        const config = alternativeCLIEngine.getConfigForFile(filename)
        return Object.assign({ filePath: filename }, config.parserOptions)
    } catch (_) {
        // ignore
    }
    return { filePath: filename }
}

/**
 * Extract rendered templates.
 * @param {string} code The source code
 * @param {string} filename filename
 * @returns {string[]} rendar scripts
 */
function extractRenderedTemplates(code, filename) {
    const result = parser.parseTemplate(code, getParserConfig(filename))
    const microTemplateService = result.services.getMicroTemplateService()

    const renderedTemplates = []
    if (microTemplateService.getMicroTemplateTokens().length) {
        const templates = new BranchedTemplateStore(
            result.ast,
            visitorKeys,
            microTemplateService.template
        )
        for (let index = 0; index < code.length; index++) {
            const { template } = templates.getBranchProcessedTemplate(index)
            if (!renderedTemplates.includes(template)) {
                renderedTemplates.push(template)
            }
        }
    } else {
        renderedTemplates.push(code)
    }

    return {
        renderedTemplates,
        microTemplateService,
    }
}

/**
 * Embed the interpolation part in the rendered template.
 */
function embedInterpolation(code, microTemplateService) {
    let renderedTemplate = code

    for (const token of microTemplateService.getMicroTemplateTokens()) {
        const length = token.range[1] - token.range[0]
        let interpolation = null
        if (token.type === "MicroTemplateEvaluate") {
            interpolation = " ".repeat(length)
        } else {
            interpolation = "+0".repeat(Math.ceil(length / 2)).slice(-length)
        }
        renderedTemplate =
            renderedTemplate.slice(0, token.range[0]) +
            interpolation +
            renderedTemplate.slice(token.range[1])
    }
    return renderedTemplate
}

/**
 * Message to string
 * @param {*} message message
 */
function messageToString(message) {
    return `${message.ruleId}:${message.line}:${message.column}:${message.endLine}:${message.endColumn}`
}

/**
 * Filter duplicate messages.
 * @param {Array<Array>} messages The base messages.
 * @returns {Array} messages The filtered messages.
 */
function filterDuplicateMessages(messages) {
    const dup = new Set()
    for (const message of messages[0]) {
        const key = messageToString(message)
        dup.add(key)
    }
    const results = [messages[0]]
    for (const msgs of messages.slice(1)) {
        const result = []
        for (const message of msgs) {
            const key = messageToString(message)
            if (!dup.has(key)) {
                result.push(message)
                dup.add(key)
            }
        }
        results.push(result)
    }
    return results
}

/**
 * Filter script messages.
 * @param {Array} messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The filtered messages.
 */
function filterScriptMessages(messages, microTemplateService) {
    return messages.filter(message => {
        if (microTemplateService.inTemplateTag(message)) {
            return false
        }
        return true
    })
}

/**
 * Disable autofix that intersect template tags.
 * @param {Array} messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function disableTagsAutofix(messages, microTemplateService) {
    return messages.map(message => {
        if (message.fix) {
            if (microTemplateService.inTemplateTag(message.fix.range)) {
                const obj = Object.assign({}, message)
                delete obj.fix
                return obj
            }
        }
        return message
    })
}

module.exports = {
    preprocess(code, filename) {
        const {
            renderedTemplates,
            microTemplateService,
        } = extractRenderedTemplates(code, filename)

        if (!microTemplateService.getMicroTemplateTokens().length) {
            return [code]
        }

        const codes = renderedTemplates.map(s => ({
            text: embedInterpolation(s, microTemplateService),
            filename: dummyFilename,
        }))

        container.addIgnoreFile(filename, s => s.endsWith(dummyFilename))

        return microTemplateProcessor.preprocess(code, filename).concat(codes)
    },

    postprocess(messages, filename) {
        const microTemplateService = container.getService(filename)
        let scriptMessages = messages.slice(1)
        if (microTemplateService) {
            scriptMessages = filterDuplicateMessages(scriptMessages)
            scriptMessages = scriptMessages.map(ms =>
                filterScriptMessages(ms, microTemplateService)
            )
            scriptMessages = scriptMessages.map(ms =>
                disableTagsAutofix(ms, microTemplateService)
            )
        }
        return microTemplateProcessor
            .postprocess(messages[0], filename)
            .concat(...scriptMessages)
    },

    supportsAutofix: microTemplateProcessor.supportsAutofix,
}
