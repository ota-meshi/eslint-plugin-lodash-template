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
        const token = parse5NodeToToken(
            child,
            parentToken,
            tokenBuilder,
            lastIndex
        )
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
    return (node, _parentToken, tokenBuilder, lastIndex) => {
        const token = tokenBuilder(type, 0, lastIndex)
        token.children = buildChildTokens(node, token, tokenBuilder, lastIndex)
        return token
    }
}

const TOKEN_BUILDERS = {
    HTMLDocument: defineRootTokenBuilder("HTMLDocument"),
    HTMLComment(node, _parentToken, tokenBuilder) {
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
    HTMLDocumentType(node, _parentToken, tokenBuilder) {
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
    HTMLText(node, _parentToken, tokenBuilder) {
        const location = node.__location
        const token = tokenBuilder(
            "HTMLText",
            location.startOffset,
            location.endOffset,
            { value: node.value }
        )
        return token
    },
    HTMLElement(node, parentToken, tokenBuilder, lastIndex) {
        const location = node.__location
        // 不正なtag構造を考慮して処理
        const range = location
            ? [location.startOffset, location.endOffset]
            : (() => {
                  const start = parentToken.startTag
                      ? parentToken.startTag.range[1]
                      : parentToken.range[0]
                  const end = parentToken.endTag
                      ? parentToken.endTag.range[0]
                      : parentToken.range[1]
                  return [start, end]
              })()
        const token = tokenBuilder("HTMLElement", range[0], range[1], {
            name: node.tagName,
        })

        if (location) {
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
        }
        token.children = buildChildTokens(node, token, tokenBuilder, lastIndex)
        if (location) {
            // adjust html text
            // `</html>`より後ろに文字がある場合不正なindex/locationになる場合がある
            token.children.forEach((n, idx) => {
                if (n.type !== "HTMLText") {
                    return
                }
                if (n.range[1] < token.range[1]) {
                    return
                }
                // 不正Text
                const newEnd = token.children[idx + 1]
                    ? token.children[idx + 1].range[0]
                    : location.endTag
                        ? location.endTag.startOffset
                        : token.range[1]
                token.children[idx] = tokenBuilder(
                    "HTMLText",
                    token.range[0],
                    newEnd,
                    {
                        value: n.value,
                    }
                )
            })
        }
        return token
    },
}

/**
 * Node to ESLint token.
 * @param {object} node The node from parse5.
 * @param {object} parentToken The parent token.
 * @param {object} tokenBuilder The tokenBuilder.
 * @param {number} lastIndex The last index.
 * @returns {object} The ESLint token.
 */
function parse5NodeToToken(node, parentToken, tokenBuilder, lastIndex) {
    const type = NODENAME_TO_TYPE_MAP[node.nodeName]
        ? NODENAME_TO_TYPE_MAP[node.nodeName]
        : "HTMLElement"

    return TOKEN_BUILDERS[type](node, parentToken, tokenBuilder, lastIndex)
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

    return parse5NodeToToken(document, null, tokenBuilder, html.length)
}

module.exports = parseHtml
