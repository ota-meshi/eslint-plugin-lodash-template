"use strict"

const container = require("../shared-container")
const MicroTemplateService = require("../service/MicroTemplateService")
const SourceCodeStore = require("../service/SourceCodeStore")
const ast = require("../ast/micro-template-nodes")

const MicroTemplateEvaluate = ast.MicroTemplateEvaluate
const MicroTemplateInterpolate = ast.MicroTemplateInterpolate
const MicroTemplateEscape = ast.MicroTemplateEscape
const MicroTemplateExpressionStart = ast.MicroTemplateExpressionStart
const MicroTemplateExpressionEnd = ast.MicroTemplateExpressionEnd

/**
 * Get delimiters from the given text and inner text.
 *
 * @param {string} text The hit text.
 * @param {string} innerCode The hit inner text.
 * @returns {Array} The delimiters result.
 */
function getDelimitersFinalMeans(text, innerCode) {
    const codeStart = text.indexOf(innerCode)
    const codeEnd = codeStart + innerCode.length
    return [text.slice(0, codeStart), text.slice(codeEnd)]
}

/**
 * Escape RegExp to given string
 * @param {string} string The base string
 * @returns {string} The escape string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&") // $&はマッチした部分文字列全体を意味します
}

/**
 * Delimiters setting to RegExp source
 *
 * @param {*} val The delimiter settings.
 * @param {Array} defaultDelimiters The default delimiters.
 * @returns {string} The delimiters RegExp source.
 */
function settingToRegExpInfo(val, defaultDelimiters) {
    if (!val) {
        return {
            pattern: `${defaultDelimiters[0]}([\\s\\S]*?)${
                defaultDelimiters[1]
            }`,
            getDelimiters: () => defaultDelimiters,
        }
    }
    if (Array.isArray(val)) {
        return {
            pattern: `${escapeRegExp(val[0])}([\\s\\S]*?)${escapeRegExp(
                val[1]
            )}`,
            getDelimiters: () => val,
        }
    }

    const source = val instanceof RegExp ? val.source : `${val}`
    const pattern =
        source.indexOf("([\\s\\S]+?)") >= 0
            ? source.replace("([\\s\\S]+?)", "([\\s\\S]*?)")
            : source.indexOf("([\\S\\s]+?)") >= 0
                ? source.replace("([\\S\\s]+?)", "([\\s\\S]*?)")
                : source

    let getDelimiters = undefined
    const delmPattern = pattern.split("([\\s\\S]*?)")
    if (delmPattern.length === 2) {
        const re = new RegExp(
            delmPattern.map(s => `(${s})`).join("([\\s\\S]*?)")
        )
        getDelimiters = (text, innerCode) => {
            const r = text.match(re)
            if (r) {
                return [r[1], r[3]]
            }
            return getDelimitersFinalMeans(text, innerCode)
        }
    } else {
        getDelimiters = getDelimitersFinalMeans
    }
    return {
        pattern,
        getDelimiters,
    }
}

/**
 * Generate micro template tokens iterator
 *
 * @param {string} code The template to parse.
 * @param {object} options The parser options.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @returns {object} The parsing result.
 */
function* genMicroTemplateTokens(code, options, sourceCodeStore) {
    const templateSettings = options.templateSettings || {}
    const evaluateInfo = settingToRegExpInfo(templateSettings.evaluate, [
        "<%",
        "%>",
    ])
    const interpolateInfo = settingToRegExpInfo(templateSettings.interpolate, [
        "<%=",
        "%>",
    ])
    const escapeInfo = settingToRegExpInfo(templateSettings.escape, [
        "<%-",
        "%>",
    ])
    const typeGetDelimiters = {
        MicroTemplateEscape: escapeInfo.getDelimiters,
        MicroTemplateInterpolate: interpolateInfo.getDelimiters,
        MicroTemplateEvaluate: evaluateInfo.getDelimiters,
    }

    const re = new RegExp(
        [
            escapeInfo.pattern,
            interpolateInfo.pattern,
            evaluateInfo.pattern,
        ].join("|"),
        "g"
    )

    let r = undefined
    while ((r = re.exec(code)) !== null) {
        const text = r[0]
        const innerCode =
            r[1] !== undefined ? r[1] : r[2] !== undefined ? r[2] : r[3]
        const start = r.index
        const end = re.lastIndex

        const Type =
            r[1] !== undefined
                ? MicroTemplateEscape
                : r[2] !== undefined
                    ? MicroTemplateInterpolate
                    : MicroTemplateEvaluate
        const node = new Type(start, end, sourceCodeStore, {
            code: innerCode,
        })

        const delims = typeGetDelimiters[node.type](text, innerCode)

        node.expressionStart = new MicroTemplateExpressionStart(
            start,
            start + delims[0].length,
            sourceCodeStore,
            {
                parent: node,
            }
        )
        node.expressionEnd = new MicroTemplateExpressionEnd(
            end - delims[1].length,
            end,
            sourceCodeStore,
            {
                parent: node,
            }
        )
        yield node
    }
}

/**
 * Parse the given template.
 * @param {string} code The template to parse.
 * @param {object} parserOptions The parser options.
 * @returns {object} The parsing result.
 */
function parseTemplate(code, parserOptions) {
    const sourceCodeStore = new SourceCodeStore(code)

    // 文字位置をそのままにしてscriptとhtmlを分解
    let script = ""
    let pre = 0
    let template = ""
    const microTemplateTokens = [] // テンプレートTokens
    for (const token of genMicroTemplateTokens(
        code,
        parserOptions,
        sourceCodeStore
    )) {
        microTemplateTokens.push(token)
        const start = token.start
        const end = token.end

        const part = code.slice(pre, start)
        script += part.replace(/\S/g, " ")
        template += part

        const scriptBeforeBase = token.expressionStart.chars
        const scriptAfterBase = token.expressionEnd.chars
        const scriptBefore = scriptBeforeBase.replace(/\S/g, " ")
        let scriptAfter = scriptAfterBase.replace(/\S/g, " ")
        if (token.type !== "MicroTemplateEvaluate") {
            scriptAfter = scriptAfter.replace(/ /, ";")
        }
        script += `${scriptBefore}${token.code}${scriptAfter}`

        template += code.slice(start, end).replace(/\S/g, " ")

        pre = end
    }
    const part = code.slice(pre, code.length)
    script += part.replace(/\S/g, " ")
    template += part

    const scriptResult = parseScript(script, parserOptions)

    sourceCodeStore.template = template
    sourceCodeStore.script = script

    const service = new MicroTemplateService({
        code,
        template,
        script,
        microTemplateTokens,
        sourceCodeStore,
        ast: scriptResult.ast,
    })
    container.addService(parserOptions.filePath, service)
    scriptResult.services = Object.assign(scriptResult.services || {}, {
        getMicroTemplateService() {
            return service
        },
    })
    return scriptResult
}

/**
 * Parse the given script source code.
 * @param {string} code The script source code to parse.
 * @param {object} parserOptions The parser options.
 * @returns {object} The parsing result.
 */
function parseScript(code, parserOptions) {
    const parser =
        parserOptions.parser === "espree" || !parserOptions.parser
            ? require("espree") // eslint-disable-line @mysticatea/node/no-extraneous-require
            : require(parserOptions.parser)
    const scriptParserOptions = Object.assign({}, parserOptions)
    delete scriptParserOptions.parser
    const result =
        typeof parser.parseForESLint === "function"
            ? parser.parseForESLint(code, scriptParserOptions)
            : parser.parse(code, scriptParserOptions)
    if (result.ast) {
        return result
    }
    return {
        ast: result,
    }
}

/**
 * Check whether the code is a HTML.
 * @param {string} code The source code to check.
 * @param {object} options The parser options.
 * @returns {boolean} `true` if the source code is a HTML.
 */
function isHtmlFile(code, options) {
    const filePath =
        typeof options.filePath === "string" ? options.filePath : "unknown.js"
    for (const ext of container.targetExtensions) {
        if (filePath.endsWith(ext)) {
            return true
        }
    }
    if (filePath.endsWith(".vue")) {
        return false
    }
    return /^\s*</.test(code)
}

/**
 * Parse the given source code.
 * @param {string} code The source code to parse.
 * @param {object} options The parser options.
 * @returns {object} The parsing result.
 */
function parseForESLint(code, options) {
    const opts = options || {}
    if (!isHtmlFile(code, opts)) {
        return parseScript(code, opts)
    }
    return parseTemplate(code, opts)
}
//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

module.exports.parse = (code, options) => parseForESLint(code, options).ast
module.exports.parseForESLint = parseForESLint
