"use strict"

const hash = require("../../utils/hash")
const { LocationCalculator, LocationMap } = require("./location-calculator")

/**
 * Checks if the given token is intersects of striped ranges
 * @param {*} token token
 * @param {*} stripedRanges ranges
 */
function isIntersects(token, stripedRanges) {
    const tokenRange = token.range
    for (const stripedRange of stripedRanges) {
        if (
            tokenRange[0] < stripedRange[1] &&
            stripedRange[0] < tokenRange[1]
        ) {
            return true
        }
    }
    return false
}

/**
 * Embed the interpolation part in the rendered template.
 */
module.exports = function(
    template,
    scriptCode,
    microTemplateService,
    stripedRanges
) {
    let code = ""
    let nextStart = 0

    const locMap = new LocationMap()

    for (const token of microTemplateService.getMicroTemplateTokens()) {
        let interpolation = null
        if (
            token.type === "MicroTemplateEvaluate" ||
            isIntersects(token, stripedRanges)
        ) {
            interpolation = "/*SCRIPTLET*/"
        } else {
            const interpolationCode = scriptCode.slice(...token.range)

            const suffix = hash(interpolationCode.replace(/\s/gu, ""))
            interpolation = `_INTERPOLATION_${suffix}`
        }

        const templateCode = template.slice(nextStart, token.range[0])
        code += templateCode + interpolation
        locMap.applyEq(templateCode.length)
        locMap.applyIns(interpolation.length)
        locMap.applyDel(token.range[1] - token.range[0])

        nextStart = token.range[1]
    }
    const templateCode = template.slice(nextStart)
    locMap.applyEq(templateCode.length)
    locMap.flush()
    code += templateCode

    const locationCalculator = new LocationCalculator(
        locMap,
        microTemplateService
    )
    return {
        code,
        locationCalculator,
    }
}
