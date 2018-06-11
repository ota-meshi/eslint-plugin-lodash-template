"use strict"

const Node = require("./node")
const Token = require("./token")

/**
 * The tag open token.
 */
class HTMLTagOpen extends Token {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLTagOpen", startIndex, endIndex, sourceCode, optProps)
    }
}

/**
 * The end tag open token.
 */
class HTMLEndTagOpen extends Token {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLEndTagOpen", startIndex, endIndex, sourceCode, optProps)
    }
}

/**
 * The tag close token.
 */
class HTMLTagClose extends Token {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode, optProps) {
        super("HTMLTagClose", startIndex, endIndex, sourceCode, optProps)
    }
}

/**
 * The self closing tag close token.
 */
class HTMLSelfClosingTagClose extends Token {
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
            "HTMLSelfClosingTagClose",
            startIndex,
            endIndex,
            sourceCode,
            optProps
        )
    }
}

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
        this._sourceCode = sourceCode
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const sourceCode = this._sourceCode

            const openBracket = sourceCode.text[this.range[0]]
            if (openBracket === "<") {
                const tagClose = this.tagClose
                const endIndex = tagClose ? tagClose.range[0] : this.range[1]
                const tagText = sourceCode.text.slice(
                    this.range[0] + 1,
                    endIndex
                )
                const index = tagText.search(/\s/)
                this._tagOpen = new HTMLTagOpen(
                    this.range[0],
                    index >= 0 ? this.range[0] + index + 1 : endIndex,
                    sourceCode,
                    { parent: this }
                )
            }
        }
        return this._tagOpen
    }

    /**
     * Get the tag close token
     * @returns {Token} The tag close token
     */
    get tagClose() {
        if (!this._tagClose) {
            const sourceCode = this._sourceCode

            const closeBracket = sourceCode.text[this.range[1] - 1]
            if (closeBracket === ">") {
                const slash = sourceCode.text[this.range[1] - 2]
                if (slash === "/") {
                    this._tagClose = new HTMLSelfClosingTagClose(
                        this.range[1] - 2,
                        this.range[1],
                        sourceCode,
                        { parent: this }
                    )
                } else {
                    this._tagClose = new HTMLTagClose(
                        this.range[1] - 1,
                        this.range[1],
                        sourceCode,
                        { parent: this }
                    )
                }
            }
        }
        return this._tagClose
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
        this._sourceCode = sourceCode
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const sourceCode = this._sourceCode

            const openBracket = sourceCode.text[this.range[0]]
            if (openBracket === "<") {
                const slash = sourceCode.text[this.range[0] + 1]
                if (slash === "/") {
                    const tagClose = this.tagClose
                    const endIndex = tagClose
                        ? tagClose.range[0]
                        : this.range[1]
                    const tagText = sourceCode.text.slice(
                        this.range[0] + 2,
                        endIndex
                    )
                    const index = tagText.search(/\s/)
                    this._tagOpen = new HTMLEndTagOpen(
                        this.range[0],
                        index >= 0 ? this.range[0] + index + 2 : endIndex,
                        sourceCode,
                        { parent: this }
                    )
                }
            }
        }
        return this._tagOpen
    }

    /**
     * Get the tag close token
     * @returns {Token} The tag close token
     */
    get tagClose() {
        if (!this._tagClose) {
            const sourceCode = this._sourceCode

            const closeBracket = sourceCode.text[this.range[1] - 1]
            if (closeBracket === ">") {
                this._tagClose = new HTMLTagClose(
                    this.range[1] - 1,
                    this.range[1],
                    sourceCode,
                    { parent: this }
                )
            }
        }
        return this._tagClose
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
