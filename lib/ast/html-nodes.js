"use strict"

const parse5 = require("parse5")
const Node = require("./node")
const Token = require("./token")

/**
 * The html token.
 */
class HTMLToken extends Token {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {string} type The token type.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, type, startIndex, endIndex, sourceCodeStore, optProps) {
        super(type, startIndex, endIndex, sourceCodeStore, optProps)
        this.html = html

        this.htmlValue = html.slice(this.range[0], this.range[1])
    }
}

/**
 * The html node.
 */
class HTMLNode extends Node {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {string} type The token type.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, type, startIndex, endIndex, sourceCodeStore, optProps) {
        super(type, startIndex, endIndex, sourceCodeStore, optProps)
        this.html = html
    }
}
/**
 * The tag open token. `<xxx`
 */
class HTMLTagOpen extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLTagOpen",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The end tag open token. `</xxx`
 */
class HTMLEndTagOpen extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLEndTagOpen",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The tag close token. `>`
 */
class HTMLTagClose extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLTagClose",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The self closing tag close token. `/>`
 */
class HTMLSelfClosingTagClose extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLSelfClosingTagClose",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The identifier token.
 */
class HTMLIdentifier extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLIdentifier",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The punctuator token.
 */
class HTMLPunctuator extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLPunctuator",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The literal token.
 */
class HTMLLiteral extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLLiteral",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The HTML comment open token. `<!--`
 */
class HTMLCommentOpen extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLCommentOpen",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }
}

/**
 * The HTML comment close token. `-->`
 */
class HTMLCommentClose extends HTMLToken {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLCommentClose",
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
class HTMLDocument extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLDocument",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.children = (optProps && optProps.children) || []
    }
}

/**
 * The HTML DocumentFragment.
 */
class HTMLDocumentFragment extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
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
class HTMLDocumentType extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
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
class HTMLComment extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLComment",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.value = (optProps && optProps.value) || ""
    }

    /**
     * Get the comment open token
     * @returns {Token} The comment open token
     */
    get commentOpen() {
        if (!this._commentOpen) {
            const html = this.html

            const open = html.slice(this.range[0], this.range[0] + 4)
            if (open === "<!--") {
                this._commentOpen = new HTMLCommentOpen(
                    html,
                    this.range[0],
                    this.range[0] + 4,
                    this.sourceCodeStore,
                    { parent: this }
                )
            }
        }
        return this._commentOpen
    }

    /**
     * Get the comment close token
     * @returns {Token} The comment close token
     */
    get commentClose() {
        if (!this._commentClose) {
            const html = this.html

            const close = html.slice(this.range[1] - 3, this.range[1])
            if (close === "-->") {
                this._commentClose = new HTMLCommentClose(
                    html,
                    this.range[1] - 3,
                    this.range[1],
                    this.sourceCodeStore,
                    { parent: this }
                )
            }
        }
        return this._commentClose
    }
}
/**
 * The HTML text node.
 */
class HTMLText extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(html, "HTMLText", startIndex, endIndex, sourceCodeStore, optProps)
        this.value = (optProps && optProps.value) || ""
    }
}
/**
 * The HTML element node.
 */
class HTMLElement extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLElement",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.name = (optProps && optProps.name) || ""
        this.startTag = (optProps && optProps.startTag) || null
        this.endTag = (optProps && optProps.endTag) || null
        this.children = (optProps && optProps.children) || []
    }
}
/**
 * The HTML attribute.
 */
class HTMLAttribute extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLAttribute",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.key = (optProps && optProps.key) || ""
        this.value = optProps && optProps.value
    }

    /**
     * Get the key token
     * @returns {HTMLIdentifier} The key token
     */
    get keyToken() {
        if (!this._keyToken) {
            const eqToken = this.eqToken
            if (eqToken) {
                const textKey = this.sourceCodeStore.text
                    .slice(this.range[0], eqToken.range[0])
                    .replace(/\s+$/g, "")
                this._keyToken = new HTMLIdentifier(
                    this.html,
                    this.range[0],
                    this.range[0] + textKey.length,
                    this.sourceCodeStore,
                    { parent: this }
                )
            } else {
                this._keyToken = new HTMLIdentifier(
                    this.html,
                    this.range[0],
                    this.range[1],
                    this.sourceCodeStore,
                    { parent: this }
                )
            }
        }
        return this._keyToken
    }

    /**
     * Get the maximum end index
     * @returns {number} The maximum end index
     */
    _getMaxEndIndex() {
        const startTag = this.parent
        const attrs = startTag.attributes.concat(startTag.ignoredAttributes)
        attrs.sort((a, b) => a.range[0] - b.range[0])
        for (const attr of attrs) {
            if (this.range[0] < attr.range[0]) {
                return attr.range[0]
            }
        }
        return startTag.tagClose
            ? startTag.tagClose.range[0]
            : startTag.range[1]
    }

    /**
     * Get the equal punctuator token
     * @returns {HTMLPunctuator|null} The equal punctuator token
     */
    get eqToken() {
        if (!this._eqToken && !this._nothingEq) {
            const startIndex = this.range[0] + this.key.length
            const endIndex =
                startIndex < this.range[1] && this.value
                    ? this.range[1]
                    : this._getMaxEndIndex()
            for (let i = startIndex; i < endIndex; i++) {
                const c = this.html[i]
                if (c === "=") {
                    this._eqToken = new HTMLPunctuator(
                        this.html,
                        i,
                        i + 1,
                        this.sourceCodeStore,
                        { parent: this }
                    )
                    break
                }
                if (c.trim()) {
                    break
                }
            }
            if (!this._eqToken) {
                this._nothingEq = true
            }
        }
        return this._eqToken || null
    }

    /**
     * Get the value token
     * @returns {HTMLLiteral|null} The value token
     */
    get valueToken() {
        if (!this._valueToken && !this._nothingEq && !this._nothingValue) {
            const eqToken = this.eqToken
            if (eqToken) {
                const text = this.sourceCodeStore.text
                const maxEndIndex = this._getMaxEndIndex()

                let startIndex = undefined
                for (let i = eqToken.range[1]; i < maxEndIndex; i++) {
                    const c = text[i]
                    if (c.match(/[^ \t\r\n]/)) {
                        startIndex = i
                        break
                    }
                }
                if (startIndex !== undefined) {
                    let endIndex = startIndex
                    for (let i = maxEndIndex - 1; i > startIndex; i--) {
                        const c = text[i]
                        if (c.match(/[^ \t\r\n]/)) {
                            endIndex = i
                            break
                        }
                    }
                    this._valueToken = new HTMLLiteral(
                        this.html,
                        startIndex,
                        endIndex + 1,
                        this.sourceCodeStore,
                        { parent: this }
                    )
                }
            }
            if (!this._valueToken) {
                this._nothingValue = true
            }
        }

        return this._valueToken || null
    }
}
/**
 * The HTML element start tag.
 */
class HTMLStartTag extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLStartTag",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
        this.attributes = (optProps && optProps.attributes) || []
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const html = this.html

            const openBracket = html[this.range[0]]
            if (openBracket === "<") {
                const tagClose = this.tagClose
                const endIndex = tagClose ? tagClose.range[0] : this.range[1]
                const tagText = html.slice(this.range[0] + 1, endIndex)
                const index = tagText.search(/\s/)
                this._tagOpen = new HTMLTagOpen(
                    html,
                    this.range[0],
                    index >= 0 ? this.range[0] + index + 1 : endIndex,
                    this.sourceCodeStore,
                    { parent: this }
                )
            }
        }
        return this._tagOpen
    }

    /**
     * Check whether this startTag is a self closing
     * @returns {boolean} `true` if this startTag is a self closing
     */
    get selfClosing() {
        return this.tagClose.type === "HTMLSelfClosingTagClose"
    }

    /**
     * Get the tag close token
     * @returns {Token} The tag close token
     */
    get tagClose() {
        if (!this._tagClose) {
            const html = this.html

            const closeBracket = html[this.range[1] - 1]
            if (closeBracket === ">") {
                const slash = html[this.range[1] - 2]
                if (slash === "/") {
                    this._tagClose = new HTMLSelfClosingTagClose(
                        html,
                        this.range[1] - 2,
                        this.range[1],
                        this.sourceCodeStore,
                        { parent: this }
                    )
                } else {
                    this._tagClose = new HTMLTagClose(
                        html,
                        this.range[1] - 1,
                        this.range[1],
                        this.sourceCodeStore,
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
            const html = this.html
            const tagStartIndex = this.range[0]
            let template = html.slice(tagStartIndex, this.range[1])

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
                template = before + target.replace(/[^ \r\n]/g, " ") + after
            }

            let attributes = this.attributes
                .slice()
                .sort((a, b) => a.range[0] - b.range[0])

            /**
             * Get the attribute range.
             * @param  {number} attrIndex The attribute index of attributes.
             * @returns {Array} The attribute range
             */
            const getAttrRange = attrIndex => {
                const attr = attributes[attrIndex]
                if (attr.range[0] + attr.key.length < attr.range[1]) {
                    return attr.range
                }
                const nextStart =
                    attrIndex + 1 < attributes.length
                        ? attributes[attrIndex + 1].range[0]
                        : this.tagClose
                        ? this.tagClose.range[0]
                        : this.range[1]

                const eqMatch = template
                    .slice(
                        attr.range[1] - tagStartIndex,
                        nextStart - tagStartIndex
                    )
                    .match(/^\s*=/)
                if (eqMatch) {
                    return [attr.range[0], attr.range[1] + eqMatch[0].length]
                }
                return attr.range
            }
            for (let i = 0; i < 100; i++) {
                for (let index = 0; index < attributes.length; index++) {
                    const range = getAttrRange(index)
                    stripAttr(range[0], range[1])
                }

                const doc = parse5.parseFragment(template, {
                    locationInfo: true,
                    sourceCodeLocationInfo: true,
                })

                const node = doc.childNodes[0]
                if (!node || !node.attrs.length) {
                    break
                }
                const location = node.__location || node.sourceCodeLocation
                for (const attr of node.attrs) {
                    const attrLoc = location.startTag.attrs[attr.name]
                    const attrToken = new HTMLAttribute(
                        html,
                        tagStartIndex + attrLoc.startOffset,
                        tagStartIndex + attrLoc.endOffset,
                        this.sourceCodeStore,
                        {
                            parent: this,
                            key: attr.name,
                            value: attr.value,
                        }
                    )
                    this._ignoredAttributes.push(attrToken)
                }
                attributes = this._ignoredAttributes
                    .slice()
                    .sort((a, b) => a.range[0] - b.range[0])
            }
        }
        return this._ignoredAttributes
    }
}
/**
 * The HTML element end tag.
 */
class HTMLEndTag extends HTMLNode {
    /**
     * constructor.
     * @param  {string} html The html text.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(html, startIndex, endIndex, sourceCodeStore, optProps) {
        super(
            html,
            "HTMLEndTag",
            startIndex,
            endIndex,
            sourceCodeStore,
            optProps
        )
    }

    /**
     * Get the tag open token
     * @returns {Token} The tag open token
     */
    get tagOpen() {
        if (!this._tagOpen) {
            const html = this.html
            const openBracket = html[this.range[0]]
            if (openBracket === "<") {
                const slash = html[this.range[0] + 1]
                if (slash === "/") {
                    const tagClose = this.tagClose
                    const endIndex = tagClose
                        ? tagClose.range[0]
                        : this.range[1]
                    const tagText = html.slice(this.range[0] + 2, endIndex)
                    const index = tagText.search(/\s/)
                    this._tagOpen = new HTMLEndTagOpen(
                        html,
                        this.range[0],
                        index >= 0 ? this.range[0] + index + 2 : endIndex,
                        this.sourceCodeStore,
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
            const html = this.html

            const closeBracket = html[this.range[1] - 1]
            if (closeBracket === ">") {
                this._tagClose = new HTMLTagClose(
                    html,
                    this.range[1] - 1,
                    this.range[1],
                    this.sourceCodeStore,
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

    HTMLIdentifier,
    HTMLPunctuator,
    HTMLLiteral,

    HTMLCommentOpen,
    HTMLCommentClose,
}
