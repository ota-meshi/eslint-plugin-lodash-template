"use strict"

const Node = require("./node")

/**
 * The HTML Document.
 */
class HTMLDocument extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLDocument", startIndex, endIndex, sourceCode, optProps)
        this.children = (optProps && optProps.children) || []
    }
}

/**
 * The HTML DocumentFragment.
 */
class HTMLDocumentFragment extends Node {
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
            "HTMLDocumentFragment",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
        this.children = (optProps && optProps.children) || []
    }
}

/**
 * The HTML Document Type.
 */
class HTMLDocumentType extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLDocumentType", startIndex, endIndex, sourceCode, optProps)
        this.name = (optProps && optProps.name) || ""
        this.publicId = (optProps && optProps.publicId) || ""
        this.systemId = (optProps && optProps.systemId) || ""
    }
}

/**
 * The HTML comment node.
 */
class HTMLComment extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLComment", startIndex, endIndex, sourceCode, optProps)
        this.value = (optProps && optProps.value) || ""
    }
}
/**
 * The HTML text node.
 */
class HTMLText extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLText", startIndex, endIndex, sourceCode, optProps)
        this.value = (optProps && optProps.value) || ""
    }
}
/**
 * The HTML element node.
 */
class HTMLElement extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLElement", startIndex, endIndex, sourceCode, optProps)
        this.name = (optProps && optProps.name) || ""
        this.startTag = (optProps && optProps.startTag) || null
        this.endTag = (optProps && optProps.endTag) || null
        this.children = (optProps && optProps.children) || []
    }
}
/**
 * The HTML element start tag.
 */
class HTMLStartTag extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLStartTag", startIndex, endIndex, sourceCode, optProps)
        this.attributes = (optProps && optProps.attributes) || []
    }
}
/**
 * The HTML attribute.
 */
class HTMLAttribute extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLAttribute", startIndex, endIndex, sourceCode, optProps)
        this.key = (optProps && optProps.key) || ""
        this.value = optProps && optProps.value
    }
}
/**
 * The HTML element end tag.
 */
class HTMLEndTag extends Node {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLEndTag", startIndex, endIndex, sourceCode, optProps)
    }
}

module.exports = {
    HTMLDocument,
    HTMLDocumentFragment,
    HTMLDocumentType,
    HTMLComment,
    HTMLText,
    HTMLElement,
    HTMLStartTag,
    HTMLAttribute,
    HTMLEndTag,
}
