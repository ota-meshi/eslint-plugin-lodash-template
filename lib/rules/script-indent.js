"use strict"

const scriptletIndent = require("./scriptlet-indent")

module.exports = {
    meta: {
        deprecated: true,
        docs: {
            description: scriptletIndent.meta.docs.description,
            category: undefined,
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.14.0/docs/rules/script-indent.md",
            replacedBy: ["scriptlet-indent"],
        },
        // eslint-disable-next-line @mysticatea/eslint-plugin/require-meta-fixable
        fixable: scriptletIndent.meta.fixable,
        messages: scriptletIndent.meta.messages,
        schema: scriptletIndent.meta.schema,
        type: scriptletIndent.meta.type,
    },

    create(context) {
        return scriptletIndent.create(context)
    },
}
