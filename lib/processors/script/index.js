"use strict"

const hash = require("../../utils/hash")
const sharedContainer = require("../../shared-container")
const microTemplateProcessor = require("../micro-template-processor")
const extractAllTemplates = require("./extract-all-templates")
const {
    groupingMessages,
    filterDuplicateMessages,
} = require("../utils/messages")

/**
 * Check if A equal B (A == B)
 * @param {object} a The location.
 * @param {object} b The location.
 */
function eq(a, b) {
    return a.line === b.line && a.column === b.column
}

/**
 * Check if A less than B (A < B)
 * @param {object} a The location.
 * @param {object} b The location.
 */
function lt(a, b) {
    if (a.line < b.line) {
        return true
    }

    if (a.line > b.line) {
        return false
    }
    return a.column < b.column
}

/**
 * Normalize location data
 */
function normalizeMessageLocs(message) {
    const messageLoc = {
        start: {
            line: message.line,
            column: message.column - 1,
        },
    }
    if (message.endLine != null && message.endColumn != null) {
        messageLoc.end = {
            line: message.endLine,
            column: message.endColumn - 1,
        }
    }
    return messageLoc
}

/**
 * Filter tag messages.
 * @param {Array<*>}messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array<*>} messages The filtered messages.
 */
function filterTagMessages(messages, microTemplateService) {
    return messages.filter((message) => {
        const messageLoc = normalizeMessageLocs(message)
        if (
            intersectsTemplateTag(
                (token) => intersectsMessageLocs(messageLoc, token),
                microTemplateService
            )
        ) {
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
    const stripedLocs = stripedRanges.map((range) => ({
        start: microTemplateService.getLocFromIndex(range[0]),
        end: microTemplateService.getLocFromIndex(range[1]),
    }))
    return messages.filter(
        (message) =>
            !stripedLocs.some((stripedLoc) =>
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
    return messages.map((message) => {
        if (message.fix) {
            const range = message.fix.range
            if (
                intersectsTemplateTag((token) => {
                    const a = range
                    const b = token.range
                    return a[0] < b[1] && b[0] < a[1]
                }, microTemplateService)
            ) {
                const obj = Object.assign({}, message)
                delete obj.fix
                return obj
            }
        }
        return message
    })
}

/**
 * Check whether the location is intersects template tag.
 * @param {function} checkIntersects The intersects check functuon.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {boolean} `true` if the location is intersects template tag.
 */
function intersectsTemplateTag(checkIntersects, microTemplateService) {
    for (const token of microTemplateService.getMicroTemplateTokens()) {
        if (checkIntersects(token)) {
            return true
        }
    }
    return false
}

/**
 * Check if the location ranges intersect.
 * @param {object} messageLoc The message locations.
 * @param {object} token The token.
 */
function intersectsMessageLocs(messageLoc, token) {
    const uselessMessageLocEnd =
        messageLoc.end == null || eq(messageLoc.start, messageLoc.end)

    if (uselessMessageLocEnd) {
        return (
            lt(token.loc.start, /* < */ messageLoc.start) &&
            lt(messageLoc.start, /* < */ token.loc.end)
        )
    }

    return (
        lt(messageLoc.start, /* < */ token.loc.end) &&
        lt(token.loc.start, /* < */ messageLoc.end)
    )
}

let processedStore = null

module.exports = {
    preprocess(code, filename) {
        if (sharedContainer.getPathCoveredTemplate(filename)) {
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

        const codes = templates.map((pathCoveredTemplate, index) => {
            const prefix = hash(pathCoveredTemplate.template)
            const scriptFilename = `eslint-plugin-lodash-template-${prefix}${index}.js`

            container.addPathCoveredTemplate(
                scriptFilename,
                pathCoveredTemplate
            )
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
            scriptMessages = scriptMessages.map((ms) =>
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
            scriptMessages = scriptMessages.map((ms) =>
                disableTagsAutofix(ms, microTemplateService)
            )

            const adjustScriptMessages = []
            for (const msgs of groupingMessages(scriptMessages).values()) {
                const msg = msgs[0]

                // TODO Handles script verify messages that are reported only on a specific path.
                // if (msgs.length < scriptMessages.length) {
                // }
                adjustScriptMessages.push(msg)
            }

            scriptMessages = [adjustScriptMessages]
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
