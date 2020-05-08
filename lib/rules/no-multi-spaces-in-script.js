"use strict"

const noMultiSpacesInScriptlet = require("./no-multi-spaces-in-scriptlet")

module.exports = {
    meta: {
        deprecated: true,
        docs: {
            description: noMultiSpacesInScriptlet.meta.docs.description,
            category: undefined,
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.17.0/docs/rules/no-multi-spaces-in-script.md",
            replacedBy: ["no-multi-spaces-in-scriptlet"],
        },
        // eslint-disable-next-line @mysticatea/eslint-plugin/require-meta-fixable
        fixable: noMultiSpacesInScriptlet.meta.fixable,
        messages: noMultiSpacesInScriptlet.meta.messages,
        schema: noMultiSpacesInScriptlet.meta.schema,
        type: noMultiSpacesInScriptlet.meta.type,
    },

    create(context) {
        return noMultiSpacesInScriptlet.create(context)
    },
}
