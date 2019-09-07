"use strict"

/**
 * Checks if the given character is a space character
 * @param {string} c character to check
 */
function isWhitespace(c) {
    return !c.trim()
}

/**
 * Replace the evaluation template tag to commentout.
 * @param {string} text evaluation template tag
 * @returns {string|null} to commentout
 */
function replaceEvaluateToComment(text) {
    const { length } = text
    for (let i = 0; i < length - 3; i++) {
        if (!isWhitespace(text[i])) {
            if (!isWhitespace(text[i + 1])) {
                for (let ii = length - 1; ii > i + 1; ii--) {
                    if (!isWhitespace(text[ii])) {
                        if (!isWhitespace(text[ii - 1])) {
                            return `${text.slice(0, i)}/*${text
                                .slice(i + 2, ii - 1)
                                .replace(
                                    /[^\r\n\u2028\u2029]/gu,
                                    " "
                                )}*/${text.slice(ii + 1)}`
                        }
                        return null
                    }
                }
            }
            return null
        }
    }
    return null
}

/**
 * Replace the evaluation template tag with the interpolation code text.
 * @param {string} text evaluation template tag
 * @returns {string} interpolation text
 */
function replaceForEvaluate(text) {
    const comment = replaceEvaluateToComment(text)
    if (comment) {
        return comment
    }
    return text.replace(/[^\r\n\u2028\u2029]/gu, " ")
}

/**
 * Embed the interpolation part in the rendered template.
 */
module.exports = function(template, originalTemplate, microTemplateService) {
    let renderedTemplate = ""
    let nextStart = 0

    for (const token of microTemplateService.getMicroTemplateTokens()) {
        const templateTagCode = originalTemplate.slice(
            token.range[0],
            token.range[1]
        )
        let interpolation = null
        if (token.type === "MicroTemplateEvaluate") {
            interpolation = replaceForEvaluate(templateTagCode)
        } else {
            interpolation = templateTagCode.replace(
                /^(\s*)\S([\s\S]*)/u,
                (_m, $1, $2) =>
                    `${$1}_${$2.replace(/[^\r\n\u2028\u2029]/gu, " ")}`
            )
        }

        renderedTemplate +=
            template.slice(nextStart, token.range[0]) + interpolation

        nextStart = token.range[1]
    }
    renderedTemplate += template.slice(nextStart)
    return renderedTemplate
}
