"use strict"

const scriptletIndent = require("./scriptlet-indent")

module.exports = {
    meta: {
        deprecated: true,
        docs: {
            // eslint-disable-next-line eslint-plugin/require-meta-docs-description -- ignore
            description: scriptletIndent.meta.docs.description,
            category: undefined,
            url:
                "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/script-indent.html",
            replacedBy: ["scriptlet-indent"],
        },
        // eslint-disable-next-line eslint-plugin/require-meta-fixable -- ignore
        fixable: scriptletIndent.meta.fixable,
        messages: scriptletIndent.meta.messages,
        // eslint-disable-next-line eslint-plugin/require-meta-schema -- ignore
        schema: scriptletIndent.meta.schema,
        type: scriptletIndent.meta.type,
    },

    create(context) {
        return scriptletIndent.create(context)
    },
}
