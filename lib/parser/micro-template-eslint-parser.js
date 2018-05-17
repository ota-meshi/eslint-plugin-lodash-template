"use strict"

const container = require("../shared-container")
const MicroTemplateService = require("../service/MicroTemplateService")

/**
 * _.sortedLastIndex
 *
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function sortedLastIndexForNum(array, value) {
    let low = 0
    let high = array == null ? low : array.length

    while (low < high) {
        const mid = (low + high) >>> 1
        const computed = array[mid]
        if (computed <= value) {
            low = mid + 1
        } else {
            high = mid
        }
    }
    return high
}

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
            pattern: `${val[0]}([\\s\\S]*?)${val[1]}`,
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
 * @param {object} tokenBuilder The tokenBuilder.
 * @returns {object} The parsing result.
 */
function* genMicroTemplateTokens(code, options, tokenBuilder) {
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
        const type =
            r[1] !== undefined
                ? "MicroTemplateEscape"
                : r[2] !== undefined
                    ? "MicroTemplateInterpolate"
                    : "MicroTemplateEvaluate"
        const text = r[0]
        const innerCode =
            r[1] !== undefined ? r[1] : r[2] !== undefined ? r[2] : r[3]
        const start = r.index
        const end = re.lastIndex
        const delims = typeGetDelimiters[type](text, innerCode)
        const token = tokenBuilder(type, start, end, {
            code: innerCode,
        })
        token.expressionStart = tokenBuilder(
            "MicroTemplateExpressionStart",
            start,
            start + delims[0].length,
            {
                chars: delims[0],
                parent: token,
            }
        )
        token.expressionEnd = tokenBuilder(
            "MicroTemplateExpressionEnd",
            end - delims[1].length,
            end,
            {
                chars: delims[1],
                parent: token,
            }
        )
        yield token
    }
}

/**
 * Define the token builder function.
 *
 * @param {string} code The template to parse.
 * @returns {object} The token builder function.
 */
function defineTokenBuilder(code) {
    const lineStartIndices = [0]

    let match = undefined
    const lineEndingPattern = /\r\n|[\r\n\u2028\u2029]/g
    while ((match = lineEndingPattern.exec(code))) {
        lineStartIndices.push(match.index + match[0].length)
    }

    /**
     * Converts a source text index into a (line, column) pair.
     * @param {number} index The index of a character in a file
     * @returns {object} A {line, column} location object with a 0-indexed column
     */
    function getLocFromIndex(index) {
        if (index === code.length) {
            return {
                line: lineStartIndices.length,
                column: index - lineStartIndices[lineStartIndices.length - 1],
            }
        }
        const lineNumber = sortedLastIndexForNum(lineStartIndices, index)

        return {
            line: lineNumber,
            column: index - lineStartIndices[lineNumber - 1],
        }
    }

    return (type, startIndex, endIndex, optProps) =>
        Object.assign(
            {
                type,
                range: [startIndex, endIndex],
                start: startIndex,
                end: endIndex,
                loc: {
                    start: getLocFromIndex(startIndex),
                    end: getLocFromIndex(endIndex),
                },
                getText() {
                    return code.slice(this.range[0], this.range[1])
                },
            },
            optProps || {}
        )
}

/**
 * Parse the given template.
 * @param {string} code The template to parse.
 * @param {object} parserOptions The parser options.
 * @returns {object} The parsing result.
 */
function parseTemplate(code, parserOptions) {
    const tokenBuilder = defineTokenBuilder(code)

    // 文字位置をそのままにしてscriptとhtmlを分解
    let script = ""
    let pre = 0
    let template = ""
    const microTemplateTokens = [] // テンプレートTokens
    for (const token of genMicroTemplateTokens(
        code,
        parserOptions,
        tokenBuilder
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

    const service = new MicroTemplateService({
        code,
        template,
        script,
        microTemplateTokens,
        tokenBuilder,
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
    const parser = require(parserOptions.parser || "espree")
    const result =
        typeof parser.parseForESLint === "function"
            ? parser.parseForESLint(code, parserOptions)
            : parser.parse(code, parserOptions)
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
    return filePath.endsWith(".html") || /^\s*</.test(code)
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
