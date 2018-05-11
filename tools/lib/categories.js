"use strict"

const rules = require("../../lib/utils/rules").rules

const categoryTitles = {
    base: "Base Rules (Enabling Correct ESLint Parsing)",
    "best-practices": "Best Practices (Improve Development Experience)",
    recommended: "Recommended (Improve Readability)",
}
const categoryIds = Object.keys(categoryTitles)
const categoryRules = rules.reduce((obj, rule) => {
    const cat = rule.meta.docs.category || "uncategorized"
    obj[cat] = obj[cat] || []
    obj[cat].push(rule)
    return obj
}, {})

// Throw if no title is defined for a category
for (const categoryId of Object.keys(categoryRules)) {
    if (categoryId !== "uncategorized" && !categoryTitles[categoryId]) {
        throw new Error(
            `Category "${categoryId}" does not have a title defined.`
        )
    }
}

module.exports = categoryIds
    .map(categoryId => ({
        categoryId,
        title: categoryTitles[categoryId],
        rules: (categoryRules[categoryId] || []).filter(
            rule => !rule.meta.deprecated
        ),
    }))
    .filter(category => category.rules.length >= 1)
