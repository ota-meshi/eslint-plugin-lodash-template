"use strict"

const crypto = require("crypto")
const sharedContainer = require("../../shared-container")
const microTemplateProcessor = require("../micro-template-processor")
const extractAllTemplates = require("./extract-all-templates")
const embedInterpolations = require("./embed-interpolations")
const { filterDuplicateMessages } = require("../utils/messages")

/**
 * Filter tag messages.
 * @param {Array<*>}messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array<*>} messages The filtered messages.
 */
function filterTagMessages(messages, microTemplateService) {
    return messages.filter(message => {
        if (microTemplateService.intersectsTemplateTag(message)) {
            return false
        }
        return true
    })
}

/**
 * Check whether the location is in range location.
 * @param {object} loc The location.
 * @param {object} start The start location.
 * @param {object} end The end location.
 * @returns {boolean} `true` if the location is in range location.
 */
function locationInRangeLoc(loc, start, end) {
    if (loc.line < start.line || end.line < loc.line) {
        return false
    }
    if (loc.line === start.line) {
        if (start.column > loc.column) {
            return false
        }
    }
    if (loc.line === end.line) {
        if (loc.column >= end.column) {
            return false
        }
    }
    return true
}

/**
 * Filter striped location messages.
 * @param {Array<*>} messages The base messages.
 * @param {[number, number][]} stripedRanges The striped ranges.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array<*>} messages The filtered messages.
 */
function filterStripedMessages(messages, stripedRanges, microTemplateService) {
    const stripedLocs = stripedRanges.map(range => ({
        start: microTemplateService.getLocFromIndex(range[0]),
        end: microTemplateService.getLocFromIndex(range[1]),
    }))
    return messages.filter(
        message =>
            !stripedLocs.some(stripedLoc =>
                locationInRangeLoc(message, stripedLoc.start, stripedLoc.end)
            )
    )
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
            if (microTemplateService.intersectsTemplateTag(message.fix.range)) {
                const obj = Object.assign({}, message)
                delete obj.fix
                return obj
            }
        }
        return message
    })
}

let processedStore = null

module.exports = {
    preprocess(code, filename) {
        if (sharedContainer.getScript(filename)) {
            // already processed
            return [code]
        }

        const { templates, microTemplateService, error } = extractAllTemplates(
            code,
            filename
        )

        if (error) {
            return microTemplateProcessor.preprocess(code, filename)
        }

        if (!microTemplateService.getMicroTemplateTokens().length) {
            // not tamplate
            return [code]
        }

        const container = sharedContainer.register(filename)

        const codes = templates.map(({ template, stripedRanges }, index) => {
            const prefix = crypto
                .createHash("md4")
                .update(template)
                .digest("hex")
            const scriptFilename = `eslint-plugin-lodash-template-${prefix}${index}.js`
            const renderdScript = embedInterpolations(
                template,
                code,
                microTemplateService,
                stripedRanges
            )
            container.addScript(scriptFilename, renderdScript)
            return {
                text: code,
                filename: scriptFilename,
            }
        })

        processedStore = { templates }

        return microTemplateProcessor.preprocess(code, filename).concat(codes)
    },

    postprocess(messages, filename) {
        const templates = processedStore && processedStore.templates
        processedStore = null
        const container = sharedContainer.get(filename)
        const microTemplateService = container && container.getService()
        let scriptMessages = messages.slice(1)
        if (microTemplateService) {
            scriptMessages = scriptMessages.map(ms =>
                filterTagMessages(ms, microTemplateService)
            )
            if (templates) {
                scriptMessages = scriptMessages.map((ms, index) =>
                    filterStripedMessages(
                        ms,
                        templates[index].stripedRanges,
                        microTemplateService
                    )
                )
            }
            scriptMessages = scriptMessages.map(ms =>
                disableTagsAutofix(ms, microTemplateService)
            )
            // TODO disable padded-blocks
        }
        const templateMessages = microTemplateProcessor.postprocess(
            [messages[0]],
            filename
        )

        return [].concat(
            ...filterDuplicateMessages([templateMessages, ...scriptMessages])
        )
    },

    supportsAutofix: microTemplateProcessor.supportsAutofix,
}
