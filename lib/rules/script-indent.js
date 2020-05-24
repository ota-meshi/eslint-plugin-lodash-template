"use strict"

const scriptletIndent = require("./scriptlet-indent")

module.exports = {
    meta: {
        deprecated: true,
        docs: {
            description: scriptletIndent.meta.docs.description,
            category: undefined,
            url:
                "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/script-indent.html",
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
