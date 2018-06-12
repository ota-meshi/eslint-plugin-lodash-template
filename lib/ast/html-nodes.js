"use strict"

const parse5 = require("parse5")
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLTagOpen", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLEndTagOpen", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLTagClose", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "HTMLSelfClosingTagClose",
            startIndex,
            endIndex,
            sourceCodeStore,
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLDocument", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "HTMLDocumentFragment",
            startIndex,
            endIndex,
            sourceCodeStore,
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            "HTMLDocumentType",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLComment", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLText", startIndex, endIndex, sourceCodeStore, optProps)
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLElement", startIndex, endIndex, sourceCodeStore, optProps)
        this.name = (optProps && optProps.name) || ""
        this.startTag = (optProps && optProps.startTag) || null
        this.endTag = (optProps && optProps.endTag) || null
        this.children = (optProps && optProps.children) || []
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLAttribute", startIndex, endIndex, sourceCodeStore, optProps)
        this.key = (optProps && optProps.key) || ""
        this.value = optProps && optProps.value
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLStartTag", startIndex, endIndex, sourceCodeStore, optProps)
        this.attributes = (optProps && optProps.attributes) || []
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const sourceCodeStore = this.sourceCodeStore

            const openBracket = sourceCodeStore.text[this.range[0]]
            if (openBracket === "<") {
                const tagClose = this.tagClose
                const endIndex = tagClose ? tagClose.range[0] : this.range[1]
                const tagText = sourceCodeStore.text.slice(
                    this.range[0] + 1,
                    endIndex
                )
                const index = tagText.search(/\s/)
                this._tagOpen = new HTMLTagOpen(
                    this.range[0],
                    index >= 0 ? this.range[0] + index + 1 : endIndex,
                    sourceCodeStore,
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
            const sourceCodeStore = this.sourceCodeStore

            const closeBracket = sourceCodeStore.text[this.range[1] - 1]
            if (closeBracket === ">") {
                const slash = sourceCodeStore.text[this.range[1] - 2]
                if (slash === "/") {
                    this._tagClose = new HTMLSelfClosingTagClose(
                        this.range[1] - 2,
                        this.range[1],
                        sourceCodeStore,
                        { parent: this }
                    )
                } else {
                    this._tagClose = new HTMLTagClose(
                        this.range[1] - 1,
                        this.range[1],
                        sourceCodeStore,
                        { parent: this }
                    )
                }
            }
        }
        return this._tagClose
    }

    /**
     * Get ignored attribute nodes.
     * Attributes not processed by parse5.
     * @returns {Array} The ignored attribute nodes
     */
    get ignoredAttributes() {
        if (this._ignoredAttributes === undefined) {
            this._ignoredAttributes = []
            if (this.tagOpen.range[1] === this.tagClose.range[0]) {
                return this._ignoredAttributes
            }
            const sourceCodeStore = this.sourceCodeStore
            const tagStartIndex = this.range[0]
            let template = sourceCodeStore.template.slice(
                tagStartIndex,
                this.range[1]
            )

            /**
             * Strip template of range.
             * @param  {number} start The start index of range.
             * @param  {number} end The end index of range.
             * @returns {void}
             */
            function stripAttr(start, end) {
                const before = template.slice(0, start - tagStartIndex)
                const target = template.slice(
                    start - tagStartIndex,
                    end - tagStartIndex
                )
                const after = template.slice(end - tagStartIndex)
                template = before + target.replace(/\S/g, " ") + after
            }

            let attributes = this.attributes
            for (;;) {
                for (const attr of attributes) {
                    stripAttr(attr.range[0], attr.range[1])
                }

                const doc = parse5.parseFragment(template, {
                    locationInfo: true,
                })

                const node = doc.childNodes[0]
                if (!node || !node.attrs.length) {
                    break
                }
                const location = node.__location
                for (const attr of node.attrs) {
                    const attrLoc = location.startTag.attrs[attr.name]
                    const attrToken = new HTMLAttribute(
                        tagStartIndex + attrLoc.startOffset,
                        tagStartIndex + attrLoc.endOffset,
                        sourceCodeStore,
                        {
                            parent: this,
                            key: attr.name,
                            value: attr.value,
                        }
                    )
                    this._ignoredAttributes.push(attrToken)
                }
                attributes = this._ignoredAttributes
            }
        }
        return this._ignoredAttributes
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
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore, optProps) {
        super("HTMLEndTag", startIndex, endIndex, sourceCodeStore, optProps)
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const sourceCodeStore = this.sourceCodeStore

            const openBracket = sourceCodeStore.text[this.range[0]]
            if (openBracket === "<") {
                const slash = sourceCodeStore.text[this.range[0] + 1]
                if (slash === "/") {
                    const tagClose = this.tagClose
                    const endIndex = tagClose
                        ? tagClose.range[0]
                        : this.range[1]
                    const tagText = sourceCodeStore.text.slice(
                        this.range[0] + 2,
                        endIndex
                    )
                    const index = tagText.search(/\s/)
                    this._tagOpen = new HTMLEndTagOpen(
                        this.range[0],
                        index >= 0 ? this.range[0] + index + 2 : endIndex,
                        sourceCodeStore,
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
            const sourceCodeStore = this.sourceCodeStore

            const closeBracket = sourceCodeStore.text[this.range[1] - 1]
            if (closeBracket === ">") {
                this._tagClose = new HTMLTagClose(
                    this.range[1] - 1,
                    this.range[1],
                    sourceCodeStore,
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
    //
    HTMLTagOpen,
    HTMLEndTagOpen,
    HTMLTagClose,
    HTMLSelfClosingTagClose,
}
