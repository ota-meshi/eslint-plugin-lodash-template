"use strict"

const container = require("../shared-container")
const microTemplateProcessor = require("./micro-template-processor")

/**
 * postprocess for comment-directive
 * @param {Array} messages The base messages.
 * @param {object} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForHtmlCommentDirective(messages, microTemplateService) {
    // Filter messages which are in disabled area.
    return messages.filter(
        message => !microTemplateService.isDisableMessageForHtml(message)
    )
}

module.exports = {
    preprocess(code, filename) {
        container.addHtmlFile(filename)
        return microTemplateProcessor.preprocess(code, filename)
    },

    postprocess(messages, filename) {
        const microTemplateService = container.getService(filename)
        if (!microTemplateService) {
            return microTemplateProcessor.postprocess(messages, filename)
        }
        const resultMessages = messages.map(m =>
            postprocessForHtmlCommentDirective(m, microTemplateService)
        )
        return microTemplateProcessor.postprocess(resultMessages, filename)
    },

    supportsAutofix: microTemplateProcessor.supportsAutofix,
}
