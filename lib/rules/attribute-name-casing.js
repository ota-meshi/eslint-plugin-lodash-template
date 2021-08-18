"use strict"

const utils = require("../utils")
const casing = require("../utils/casing")

const converter = casing.getConverter("kebab-case")

const DEFAULTS = {
    ignore: [],
    ignoreSvgCamelCaseAttributes: true,
}

const SVG_CAMEL_ATTRS = [
    "allowReorder",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "contentScriptType",
    "contentStyleType",
    "diffuseConstant",
    "edgeMode",
    "externalResourcesRequired",
    "filterRes",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "referrerPolicy",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
]

module.exports = {
    meta: {
        docs: {
            description:
                "enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/attribute-name-casing.html",
        },
        fixable: "code",
        messages: {
            unexpected: "Attribute `{{text}}` must be 'kebab-case'.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    ignoreSvgCamelCaseAttributes: {
                        type: "boolean",
                    },
                    ignore: {
                        type: "array",
                        items: {
                            allOf: [
                                { type: "string" },
                                { not: { type: "string", pattern: ":exit$" } },
                                { not: { type: "string", pattern: "^\\s*$" } },
                            ],
                        },
                        uniqueItems: true,
                        additionalItems: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        type: "suggestion",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {}
        }
        const option = Object.assign({}, DEFAULTS, context.options[0] || {})
        const ignore = []
            .concat(option.ignore || [])
            // https://github.com/ota-meshi/eslint-plugin-lodash-template/issues/140
            .concat(option.ignoreSvgCamelCaseAttributes ? SVG_CAMEL_ATTRS : [])

        const microTemplateService =
            context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLAttribute(node) {
                        const keyToken = node.keyToken
                        const actualKey = keyToken.htmlValue.trim()
                        if (ignore.indexOf(actualKey) >= 0) {
                            return
                        }
                        const expectKey = converter(actualKey)

                        if (expectKey !== keyToken.htmlValue) {
                            context.report({
                                node: keyToken,
                                messageId: "unexpected",
                                data: {
                                    text: actualKey,
                                },
                                fix:
                                    keyToken.htmlValue === keyToken.value &&
                                    keyToken.htmlValue.toLowerCase() ===
                                        expectKey
                                        ? (fixer) =>
                                              fixer.replaceText(
                                                  keyToken,
                                                  expectKey,
                                              )
                                        : undefined,
                            })
                        }
                    },
                })
            },
        }
    },
}
