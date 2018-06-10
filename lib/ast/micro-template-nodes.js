"use strict"

const Token = require("./token")
const Node = require("./node")

/**
 * The template tag that is evaluated as script.
 */
class MicroTemplateEvaluate extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super(
            "MicroTemplateEvaluate",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
        this.expressionStart = optProps && optProps.expressionStart
        this.expressionEnd = optProps && optProps.expressionEnd
        this.code = optProps && optProps.code
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

/**
 * The template tag that is interpolate as template.
 */
class MicroTemplateInterpolate extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super(
            "MicroTemplateInterpolate",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
        this.expressionStart = optProps && optProps.expressionStart
        this.expressionEnd = optProps && optProps.expressionEnd
        this.code = optProps && optProps.code
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

/**
 * The template tag that is escapes to interpolate as template.
 */
class MicroTemplateEscape extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("MicroTemplateEscape", startIndex, endIndex, sourceCode, optProps)
        this.expressionStart = optProps && optProps.expressionStart
        this.expressionEnd = optProps && optProps.expressionEnd
        this.code = optProps && optProps.code
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

/**
 * The start tag of the template tag.
 */
class MicroTemplateExpressionStart extends Token {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super(
            "MicroTemplateExpressionStart",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
        this.chars = (optProps && optProps.chars) || ""
    }
}

/**
 * The end tag of the template tag.
 */
class MicroTemplateExpressionEnd extends Token {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super(
            "MicroTemplateExpressionEnd",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
        this.chars = (optProps && optProps.chars) || ""
    }
}

module.exports = {
    MicroTemplateEvaluate,
    MicroTemplateInterpolate,
    MicroTemplateEscape,
    MicroTemplateExpressionStart,
    MicroTemplateExpressionEnd,
}
