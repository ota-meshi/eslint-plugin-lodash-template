const { rules } = require("../../lib/utils/rules")
const categories = require("../../tools/lib/categories")

const uncategorizedRules = rules.filter(
    rule => !rule.meta.docs.category && !rule.meta.deprecated
)
const deprecatedRules = rules.filter(rule => rule.meta.deprecated)

const extraCategories = []
if (uncategorizedRules.length > 0) {
    extraCategories.push({
        title: "Uncategorized",
        collapsable: false,
        children: uncategorizedRules.map(
            ({
                meta: {
                    docs: { ruleId, ruleName },
                },
            }) => [`/rules/${ruleName}`, ruleId]
        ),
    })
}
if (deprecatedRules.length > 0) {
    extraCategories.push({
        title: "Deprecated",
        collapsable: false,
        children: deprecatedRules.map(
            ({
                meta: {
                    docs: { ruleId, ruleName },
                },
            }) => [`/rules/${ruleName}`, ruleId]
        ),
    })
}

module.exports = {
    base: "/eslint-plugin-lodash-template/",
    title: "eslint-plugin-lodash-template",
    description:
        "ESLint plugin for John Resig-style micro template / Lodash's template / Underscore's template.",
    serviceWorker: true,
    evergreen: true,
    configureWebpack(_config, _isServer) {
        return {
            resolve: {
                alias: {
                    eslint: require.resolve("./shim/eslint"),
                    crypto: require.resolve("./shim/crypto"),
                },
            },
        }
    },

    head: [["link", { rel: "icon", type: "image/png", href: "/logo.png" }]],
    themeConfig: {
        logo: "/logo.svg",
        repo: "ota-meshi/eslint-plugin-lodash-template",
        docsRepo: "ota-meshi/eslint-plugin-lodash-template",
        docsDir: "docs",
        docsBranch: "master",
        editLinks: true,
        lastUpdated: true,
        serviceWorker: {
            updatePopup: true,
        },

        nav: [
            { text: "Rules", link: "/rules/" },
            { text: "Playground", link: "/playground/" },
            { text: "Contributing", link: "/services/" },
        ],

        sidebar: {
            "/rules/": [
                "/rules/",

                // Rules in each category.
                ...categories
                    .map(({ title, rules: catRules }) => ({
                        title: title.replace(/ \(.+?\)/u, ""),
                        collapsable: false,
                        children: catRules.map(
                            ({
                                meta: {
                                    docs: { ruleId, ruleName },
                                },
                            }) => [`/rules/${ruleName}`, ruleId]
                        ),
                    }))
                    .filter(menu => Boolean(menu.children.length)),

                // Rules in no category.
                ...extraCategories,
            ],
            "/migration/": ["/migration/", "/migration/0.13to0.14"],
            "/": ["/", "/rules/", "/playground/", "/services/", "/migration/"],
        },
    },
}
