// @ts-check
"use strict";

const sharedContainer = require("../shared-container");
const microTemplateProcessor = require("./micro-template-processor");
const baseMeta = require("../meta");

/**
 * @typedef {import('../services/micro-template-service')} MicroTemplateService
 */

/**
 * postprocess for comment-directive
 * @param {Array} messages The base messages.
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForHtmlCommentDirective(messages, microTemplateService) {
    // Filter messages which are in disabled area.
    return messages.filter(
        (message) => !microTemplateService.isDisableMessageForHtml(message)
    );
}

module.exports = {
    preprocess(code, filename) {
        sharedContainer.register(filename).html();
        return microTemplateProcessor.preprocess(code, filename);
    },

    postprocess(messages, filename) {
        const container = sharedContainer.get(filename);
        const microTemplateService =
            container && container.getService(filename);
        if (!microTemplateService) {
            return microTemplateProcessor.postprocess(messages, filename);
        }
        const resultMessages = messages.map((m) =>
            postprocessForHtmlCommentDirective(m, microTemplateService)
        );
        return microTemplateProcessor.postprocess(resultMessages, filename);
    },

    supportsAutofix: microTemplateProcessor.supportsAutofix,

    meta: {
        name: `${baseMeta.name}/html`,
        version: baseMeta.version,
    },
};
