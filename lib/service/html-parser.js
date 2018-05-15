"use strict"

const parse5 = require("parse5")

const NODENAME_TO_TYPE_MAP = {
    "#document": "HTMLDocument",
    "#comment": "HTMLComment",
    "#document-fragment": "HTMLDocumentFragment",
    "#documentType": "HTMLDocumentType",
    "#text": "HTMLText",
}

/**
 * Create child tokens from Node childNodes
 * @param {object} node The node from parse5.
 * @param {object} parentToken The parent token.
 * @param {object} tokenBuilder The tokenBuilder.
 * @param {number} lastIndex The last index.
 * @returns {Array} The child tokens.
 */
function buildChildTokens(node, parentToken, tokenBuilder, lastIndex) {
    return node.childNodes.map(child => {
        const token = parse5NodeToToken(child, tokenBuilder, lastIndex)
        token.parent = parentToken
        return token
    })
}

/**
 * Define root token builder
 * @param {string} type The token type.
 * @returns {function} The token builder.
 */
function defineRootTokenBuilder(type) {
    return (node, tokenBuilder, lastIndex) => {
        const token = tokenBuilder(type, 0, lastIndex)
        token.children = buildChildTokens(node, token, tokenBuilder, lastIndex)
        return token
    }
}

const TOKEN_BUILDERS = {
    HTMLDocument: defineRootTokenBuilder("HTMLDocument"),
    HTMLComment(node, tokenBuilder) {
        const location = node.__location
        const token = tokenBuilder(
            "HTMLComment",
            location.startOffset,
            location.endOffset,
            { value: node.data }
        )
        return token
    },
    HTMLDocumentFragment: defineRootTokenBuilder("HTMLDocumentFragment"),
    HTMLDocumentType(node, tokenBuilder) {
        const location = node.__location
        const token = tokenBuilder(
            "HTMLDocumentType",
            location.startOffset,
            location.endOffset,
            {
                name: node.name,
                publicId: node.publicId,
                systemId: node.systemId,
            }
        )
        return token
    },
    HTMLText(node, tokenBuilder) {
        const location = node.__location
        const token = tokenBuilder(
            "HTMLText",
            location.startOffset,
            location.endOffset,
            { value: node.value }
        )
        return token
    },
    HTMLElement(node, tokenBuilder, lastIndex) {
        const location = node.__location
        const token = tokenBuilder(
            "HTMLElement",
            location ? location.startOffset : 0,
            location ? location.endOffset : lastIndex,
            {
                name: node.tagName,
            }
        )
        token.children = buildChildTokens(node, token, tokenBuilder, lastIndex)
        if (!location) {
            return token
        }
        const startTag = (token.startTag = tokenBuilder(
            "HTMLStartTag",
            location.startTag.startOffset,
            location.startTag.endOffset,
            { parent: token }
        ))
        startTag.attributes = node.attrs.map(attr => {
            const attrLoc = location.startTag.attrs[attr.name]
            const attrToken = tokenBuilder(
                "HTMLAttribute",
                attrLoc.startOffset,
                attrLoc.endOffset,
                {
                    parent: startTag,
                    key: attr.name,
                    value: attr.value,
                }
            )
            return attrToken
        })
        if (location.endTag) {
            token.endTag = tokenBuilder(
                "HTMLEndTag",
                location.endTag.startOffset,
                location.endTag.endOffset,
                { parent: token }
            )
        }
        return token
    },
}

/**
 * Node to ESLint token.
 * @param {object} node The node from parse5.
 * @param {object} tokenBuilder The tokenBuilder.
 * @param {number} lastIndex The last index.
 * @returns {object} The ESLint token.
 */
function parse5NodeToToken(node, tokenBuilder, lastIndex) {
    const type = NODENAME_TO_TYPE_MAP[node.nodeName]
        ? NODENAME_TO_TYPE_MAP[node.nodeName]
        : "HTMLElement"

    return TOKEN_BUILDERS[type](node, tokenBuilder, lastIndex)
}

/**
 * Parse the given html.
 * @param {string} html The html source code to parse.
 * @param {object} tokenBuilder The tokenBuilder.
 * @returns {object} The parsing result.
 */
function parseHtml(html, tokenBuilder) {
    const document = parse5.parse(html, {
        locationInfo: true,
        // sourceCodeLocationInfo: true ?
    })

    return parse5NodeToToken(document, tokenBuilder, html.length)
}

module.exports = parseHtml
