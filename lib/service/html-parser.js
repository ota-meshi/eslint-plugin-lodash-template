"use strict"

const parse5 = require("parse5")

const NODENAME_TO_TYPE_MAP = {
    "#document": "HTMLDocument",
    "#comment": "HTMLComment",
    "#document-fragment": "HTMLDocumentFragment",
    "#documentType": "HTMLDocumentType",
    "#text": "HTMLText",
}
const ast = require("../ast/html-nodes")

const HTMLDocument = ast.HTMLDocument
const HTMLDocumentFragment = ast.HTMLDocumentFragment
const HTMLDocumentType = ast.HTMLDocumentType
const HTMLComment = ast.HTMLComment
const HTMLText = ast.HTMLText
const HTMLElement = ast.HTMLElement
const HTMLStartTag = ast.HTMLStartTag
const HTMLAttribute = ast.HTMLAttribute
const HTMLEndTag = ast.HTMLEndTag

/**
 * Create child tokens from Node childNodes
 * @param {object} node The node from parse5.
 * @param {object} parentToken The parent token.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @param {number} lastIndex The last index.
 * @returns {Array} The child tokens.
 */
function buildChildTokens(node, parentToken, sourceCodeStore, lastIndex) {
    return node.childNodes.map(child => {
        const token = parse5NodeToToken(
            child,
            parentToken,
            sourceCodeStore,
            lastIndex
        )
        token.parent = parentToken
        return token
    })
}

/**
 * Define root token builder
 * @param {Class} Type The token type.
 * @returns {function} The token builder.
 */
function defineRootTokenBuilder(Type) {
    return (node, _parentToken, sourceCodeStore, lastIndex) => {
        const token = new Type(0, lastIndex, sourceCodeStore)
        token.children = buildChildTokens(
            node,
            token,
            sourceCodeStore,
            lastIndex
        )
        return token
    }
}

const TOKEN_BUILDERS = {
    HTMLDocument: defineRootTokenBuilder(HTMLDocument),
    HTMLComment(node, _parentToken, sourceCodeStore) {
        const location = node.__location
        const token = new HTMLComment(
            location.startOffset,
            location.endOffset,
            sourceCodeStore,
            { value: node.data }
        )
        return token
    },
    HTMLDocumentFragment: defineRootTokenBuilder(HTMLDocumentFragment),
    HTMLDocumentType(node, _parentToken, sourceCodeStore) {
        const location = node.__location
        const token = new HTMLDocumentType(
            location.startOffset,
            location.endOffset,
            sourceCodeStore,
            {
                name: node.name,
                publicId: node.publicId,
                systemId: node.systemId,
            }
        )
        return token
    },
    HTMLText(node, _parentToken, sourceCodeStore) {
        const location = node.__location
        const token = new HTMLText(
            location.startOffset,
            location.endOffset,
            sourceCodeStore,
            { value: node.value }
        )
        return token
    },
    HTMLElement(node, parentToken, sourceCodeStore, lastIndex) {
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
        const token = new HTMLElement(range[0], range[1], sourceCodeStore, {
            name: node.tagName,
        })

        if (location) {
            const startTag = (token.startTag = new HTMLStartTag(
                location.startTag.startOffset,
                location.startTag.endOffset,
                sourceCodeStore,
                { parent: token }
            ))
            startTag.attributes = node.attrs.map(attr => {
                const attrLoc = location.startTag.attrs[attr.name]
                const attrToken = new HTMLAttribute(
                    attrLoc.startOffset,
                    attrLoc.endOffset,
                    sourceCodeStore,
                    {
                        parent: startTag,
                        key: attr.name,
                        value: attr.value,
                    }
                )
                return attrToken
            })
            if (location.endTag) {
                token.endTag = new HTMLEndTag(
                    location.endTag.startOffset,
                    location.endTag.endOffset,
                    sourceCodeStore,
                    { parent: token }
                )
            }
        }
        token.children = buildChildTokens(
            node,
            token,
            sourceCodeStore,
            lastIndex
        )
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
                token.children[idx] = new HTMLText(
                    token.range[0],
                    newEnd,
                    sourceCodeStore,
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
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @param {number} lastIndex The last index.
 * @returns {object} The ESLint token.
 */
function parse5NodeToToken(node, parentToken, sourceCodeStore, lastIndex) {
    const type = NODENAME_TO_TYPE_MAP[node.nodeName]
        ? NODENAME_TO_TYPE_MAP[node.nodeName]
        : "HTMLElement"

    return TOKEN_BUILDERS[type](node, parentToken, sourceCodeStore, lastIndex)
}

/**
 * Parse the given html.
 * @param {string} html The html source code to parse.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @returns {object} The parsing result.
 */
function parseHtml(html, sourceCodeStore) {
    const isFragment = !/^\s*<(!doctype|html|head|body|!--)/i.test(html)
    const document = (isFragment ? parse5.parseFragment : parse5.parse)(html, {
        locationInfo: true,
        // sourceCodeLocationInfo: true ?
    })

    return parse5NodeToToken(document, null, sourceCodeStore, html.length)
}

module.exports = parseHtml
