"use strict"

/**
 * Convert text to kebab-case
 * @param {string} str Text to be converted
 * @returns {string} Converted string
 */
function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[-_\s]+/g, "-")
        .toLowerCase()
}

/**
 * Convert text to snake_case
 * @param {string} str Text to be converted
 * @returns {string} Converted string
 */
function snakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[-_\s]+/g, "_")
        .toLowerCase()
}

/**
 * Convert text to camelCase
 * @param {string} str Text to be converted
 * @returns {string} Converted string
 */
function camelCase(str) {
    return str
        .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^./, c => c.toLowerCase())
}

/**
 * Convert text to PascalCase
 * @param {string} str Text to be converted
 * @returns {string} Converted string
 */
function pascalCase(str) {
    return str
        .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^./, c => c.toUpperCase())
}

const convertersMap = {
    "kebab-case": kebabCase,
    snake_case: snakeCase, //eslint-disable-line camelcase
    camelCase,
    PascalCase: pascalCase,
}

module.exports = {
    /**
     * Return case converter
     * @param {string} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase', 'snake_case')
     * @returns {kebabCase|camelCase|pascalCase|snake_case} converter
     */
    getConverter(name) {
        return convertersMap[name]
    },
}
