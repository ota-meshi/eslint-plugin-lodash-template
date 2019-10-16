"use strict"

const parser = require("../../parser/micro-template-eslint-parser")
const BranchedTemplateStore = require("../../../lib/services/BranchedTemplateStore")
// eslint-disable-next-line @mysticatea/node/no-unpublished-require
const visitorKeys = require("eslint-visitor-keys").KEYS
const getConfig = require("../utils/get-config")

/**
 * Get the parser config
 * @param {string} filename
 */
function getParserConfig(filename) {
    const config = getConfig(filename)
    return Object.assign({ filePath: filename }, config.parserOptions)
}

/**
 * Extract all templates that cover all branches.
 * @param {string} code The source code
 * @param {string} filename filename
 * @returns {{templates: BranchedTemplate[], microTemplateService: MicroTemplateService}} all templates that cover all branches.
 */
module.exports = function(code, filename) {
    let result = null
    try {
        result = parser.parseTemplate(code, getParserConfig(filename))
    } catch (error) {
        return {
            error,
        }
    }
    const microTemplateService = result.services.getMicroTemplateService()

    if (!microTemplateService.getMicroTemplateTokens().length) {
        return {
            templates: [
                {
                    template: code,
                    stripedRanges: [],
                },
            ],
            microTemplateService,
        }
    }
    const templates = new BranchedTemplateStore(
        result.ast,
        result.visitorKeys || visitorKeys,
        microTemplateService.template
    )

    return {
        templates: templates.getAllTemplates(),
        microTemplateService,
    }
}
