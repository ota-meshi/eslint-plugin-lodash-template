"use strict"

const path = require("path")
const sharedContainer = require("../shared-container")
const MicroTemplateService = require("../services/MicroTemplateService")
const SourceCodeStore = require("../services/SourceCodeStore")
const ast = require("../ast/micro-template-nodes")
const parseScript = require("./parse-script")
const parseTemplateScript = require("./parse-template-script")

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
    return string.replace(/[.*+?^=!:${}()|[\]/\\]/gu, "\\$&") // $&はマッチした部分文字列全体を意味します
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
            delmPattern.map(s => `(${s})`).join("([\\s\\S]*?)"),
            "u"
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
        "gu"
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
 * Replace to whitespaces
 * @param {string} s string
 * @returns {string} whitespaces
 */
function replaceToWhitespace(s) {
    return s.replace(/[^ \r\n\t\f\u2028\u2029]/gu, " ")
}

/**
 * Parse the given template.
 * @param {string} code The template to parse.
 * @param {object} options The parser options.
 * @returns {object} The parsing result.
 */
function parseTemplate(code, options) {
    const parserOptions = normalizeOptions(options)
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
        script += replaceToWhitespace(part)
        template += part

        const scriptBeforeBase = token.expressionStart.chars
        const scriptAfterBase = token.expressionEnd.chars
        const scriptBefore = replaceToWhitespace(scriptBeforeBase)
        let scriptAfter = replaceToWhitespace(scriptAfterBase)
        if (token.type !== "MicroTemplateEvaluate") {
            scriptAfter = scriptAfter.replace(/ /u, ";")
        }
        script += `${scriptBefore}${token.code}${scriptAfter}`

        template += replaceToWhitespace(code.slice(start, end))

        pre = end
    }
    const part = code.slice(pre, code.length)
    script += replaceToWhitespace(part)
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
    scriptResult.services = Object.assign(scriptResult.services || {}, {
        getMicroTemplateService() {
            return service
        },
    })
    return scriptResult
}

/**
 * Check whether the code is a tamplate file.
 * @param {string} code The source code to check.
 * @param {object} options The parser options.
 * @returns {number} `1` if the source code is a tamplate file. `2` if the source code is the script template.
 */
function getParseTargetKind(code, options) {
    const filePath =
        typeof options.filePath === "string" ? options.filePath : "unknown.js"

    if (sharedContainer.getBranchedTemplate(filePath)) {
        return 2
    }

    const container = sharedContainer.get(filePath)
    if (container && container.isHtml()) {
        return 1
    }
    if (container && container.isParseTarget()) {
        return 1
    }
    if (filePath.toLowerCase().endsWith(".html")) {
        return 1
    }
    if (filePath.toLowerCase().endsWith(".vue")) {
        return 0
    }
    return /^\s*</u.test(code) ? 1 : 0
}

/**
 * Parse the given source code.
 * @param {string} code The source code to parse.
 * @param {object} options The parser options.
 * @returns {object} The parsing result.
 */
function parseForESLint(code, options) {
    const parserOptions = normalizeOptions(options)
    const targetKind = getParseTargetKind(code, parserOptions)
    if (targetKind === 0) {
        // Not a micro template.
        return parseScript(code, parserOptions)
    }
    if (targetKind === 2) {
        const templatePath = path.dirname(parserOptions.filePath)
        const container = sharedContainer.get(templatePath)
        const service = container && container.getService()
        // Micro template. Parse the script with the template tag removed.
        return parseTemplateScript(
            sharedContainer.getBranchedTemplate(options.filePath),
            code,
            parserOptions,
            service ||
                parseTemplate(
                    code,
                    parserOptions
                ).services.getMicroTemplateService()
        )
    }
    // targetKind === 1
    // Micro template. Parse template tags.
    const result = parseTemplate(code, parserOptions)

    // Store the service for use in postprocess.
    const service = result.services.getMicroTemplateService()
    const container = sharedContainer.get(parserOptions.filePath)
    if (container) {
        container.setService(service)
    }

    return result
}

/**
 * Normalize parser options
 * @param {*} options options
 */
function normalizeOptions(options) {
    return Object.assign(
        {
            comment: true,
            ecmaVersion: 9,
            eslintScopeManager: true,
            eslintVisitorKeys: true,
            loc: true,
            range: true,
            raw: true,
            tokens: true,
        },
        options
    )
}

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

module.exports.parse = (code, options) => parseForESLint(code, options).ast
module.exports.parseForESLint = parseForESLint
module.exports.parseTemplate = parseTemplate
