"use strict"

/**
 * Checks if the given character is a linebreak character
 * @param {string} c character to check
 */
function isLinebreak(c) {
    return c === "\n" || c === "\r" || c === "\u2028" || c === "\u2029"
}

/**
 * Replace the template tag to commentout.
 * @param {string} text template tag
 * @returns {string|null} commentout
 */
function replaceEvaluateToComment(text) {
    const { length } = text
    if (
        length >= 4 &&
        !isLinebreak(text[0]) &&
        !isLinebreak(text[1]) &&
        !isLinebreak(text[length - 1]) &&
        !isLinebreak(length - 2)
    ) {
        return `/*${text.slice(2, -2).replace(/\S/gu, " ")}*/`
    }
    return null
}

/**
 * Replace the template tag to identifier and commentout.
 * @param {string} text template tag
 * @returns {string|null} identifier and commentout
 */
function replaceInterpolationToIdAndComment(text) {
    const { length } = text
    if (
        length >= 5 &&
        !isLinebreak(text[0]) &&
        !isLinebreak(text[1]) &&
        !isLinebreak(text[2]) &&
        !isLinebreak(text[length - 1]) &&
        !isLinebreak(length - 2)
    ) {
        return `_/*${text.slice(3, -2).replace(/\S/gu, " ")}*/`
    }
    return null
}

/**
 * Replace the evaluation template tag with the code text.
 * @param {string} text evaluation template tag
 * @returns {string}  text
 */
function replaceForEvaluate(text) {
    const comment = replaceEvaluateToComment(text)
    if (comment) {
        return comment
    }
    return text.replace(/\S/gu, " ")
}

/**
 * Replace the interpolation template tag with the code text.
 * @param {string} text interpolation template tag
 * @returns {string}  text
 */
function replaceForInterpolation(text) {
    const comment = replaceInterpolationToIdAndComment(text)
    if (comment) {
        return comment
    }
    return text.replace(
        /^(\s*)\S([\s\S]*)/u,
        (_m, $1, $2) => `${$1}_${$2.replace(/\S/gu, " ")}`
    )
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
            interpolation = replaceForInterpolation(templateTagCode)
        }

        renderedTemplate +=
            template.slice(nextStart, token.range[0]) + interpolation

        nextStart = token.range[1]
    }
    renderedTemplate += template.slice(nextStart)
    return renderedTemplate
}
