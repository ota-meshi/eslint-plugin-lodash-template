"use strict"

const parse5 = require("parse5")
const ast = require("../ast/html-nodes")

const NODENAME_TO_TYPE_MAP = {
    "#document": "HTMLDocument",
    "#comment": "HTMLComment",
    "#document-fragment": "HTMLDocumentFragment",
    "#documentType": "HTMLDocumentType",
    "#text": "HTMLText",
}
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
 * @param {string} html The html source code to parse.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @param {number} lastIndex The last index.
 * @returns {Array} The child tokens.
 */
function buildChildTokens(node, parentToken, html, sourceCodeStore, lastIndex) {
    return node.childNodes.map((child) => {
        const token = parse5NodeToToken(
            child,
            parentToken,
            html,
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
    return (node, _parentToken, html, sourceCodeStore, lastIndex) => {
        const token = new Type(html, 0, lastIndex, sourceCodeStore)
        token.children = buildChildTokens(
            node,
            token,
            html,
            sourceCodeStore,
            lastIndex
        )
        return token
    }
}

const TOKEN_BUILDERS = {
    HTMLDocument: defineRootTokenBuilder(HTMLDocument),
    HTMLComment(node, _parentToken, html, sourceCodeStore) {
        const location = node.sourceCodeLocation
        const token = new HTMLComment(
            html,
            location.startOffset,
            location.endOffset,
            sourceCodeStore,
            { value: node.data }
        )
        return token
    },
    HTMLDocumentFragment: defineRootTokenBuilder(HTMLDocumentFragment),
    HTMLDocumentType(node, _parentToken, html, sourceCodeStore) {
        const location = node.sourceCodeLocation
        const token = new HTMLDocumentType(
            html,
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
    HTMLText(node, _parentToken, html, sourceCodeStore) {
        const location = node.sourceCodeLocation
        const token = new HTMLText(
            html,
            location.startOffset,
            location.endOffset,
            sourceCodeStore,
            { value: node.value }
        )
        return token
    },
    HTMLElement(node, parentToken, html, sourceCodeStore, lastIndex) {
        const location = node.sourceCodeLocation
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
        const token = new HTMLElement(
            html,
            range[0],
            range[1],
            sourceCodeStore,
            {
                name: node.tagName,
            }
        )

        if (location) {
            const startTag = (token.startTag = new HTMLStartTag(
                html,
                location.startTag.startOffset,
                location.startTag.endOffset,
                sourceCodeStore,
                { parent: token }
            ))
            startTag.attributes = node.attrs.map((attr) => {
                const key = attr.prefix
                    ? `${attr.prefix}:${attr.name}`
                    : attr.name
                // https://github.com/ota-meshi/eslint-plugin-lodash-template/issues/139
                const attrLoc =
                    key in location.startTag.attrs
                        ? location.startTag.attrs[key]
                        : location.startTag.attrs[key.toLowerCase()] // fix for viewBox and other camelCase attributes in SVG
                const attrToken = new HTMLAttribute(
                    html,
                    attrLoc.startOffset,
                    attrLoc.endOffset,
                    sourceCodeStore,
                    {
                        parent: startTag,
                        key,
                        value: attr.value,
                    }
                )
                return attrToken
            })
            if (location.endTag) {
                token.endTag = new HTMLEndTag(
                    html,
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
            html,
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
                    html,
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
 * @param {string} html The html source code to parse.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @param {number} lastIndex The last index.
 * @returns {object} The ESLint token.
 */
function parse5NodeToToken(
    node,
    parentToken,
    html,
    sourceCodeStore,
    lastIndex
) {
    const type = NODENAME_TO_TYPE_MAP[node.nodeName]
        ? NODENAME_TO_TYPE_MAP[node.nodeName]
        : "HTMLElement"

    return TOKEN_BUILDERS[type](
        node,
        parentToken,
        html,
        sourceCodeStore,
        lastIndex
    )
}

/**
 * Parse the given html.
 * @param {string} html The html source code to parse.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @returns {object} The parsing result.
 */
function parseHtml(html, sourceCodeStore) {
    const isFragment = !/^\s*<(!doctype|html|head|body|!--)/iu.test(html)
    const document = (isFragment ? parse5.parseFragment : parse5.parse)(html, {
        sourceCodeLocationInfo: true,
    })

    return parse5NodeToToken(document, null, html, sourceCodeStore, html.length)
}

module.exports = parseHtml
