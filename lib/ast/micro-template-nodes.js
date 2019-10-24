"use strict"

const Token = require("./token")
const Node = require("./node")

/**
 * The template tag that is evaluated as scriptlet.
 */
class MicroTemplateEvaluate extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateEvaluate",
            startIndex,
            endIndex,
            sourceCodeStore,
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateInterpolate",
            startIndex,
            endIndex,
            sourceCodeStore,
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateEscape",
            startIndex,
            endIndex,
            sourceCodeStore,
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
 * The template tag that is comment as template.
 */
class MicroTemplateComment extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateComment",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.expressionStart = optProps && optProps.expressionStart
        this.expressionEnd = optProps && optProps.expressionEnd
        this.code = optProps && optProps.code
    }

    get value() {
        return this.code
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateExpressionStart",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.chars = this.value
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "MicroTemplateExpressionEnd",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.chars = this.value
    }
}

module.exports = {
    MicroTemplateEvaluate,
    MicroTemplateInterpolate,
    MicroTemplateEscape,
    MicroTemplateComment,
    MicroTemplateExpressionStart,
    MicroTemplateExpressionEnd,
}
