"use strict";

const noMultiSpacesInScriptlet = require("./no-multi-spaces-in-scriptlet");

module.exports = {
    meta: {
        deprecated: true,
        docs: {
            description: noMultiSpacesInScriptlet.meta.docs.description,
            category: undefined,
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-multi-spaces-in-script.html",
            replacedBy: ["no-multi-spaces-in-scriptlet"],
        },
        fixable: noMultiSpacesInScriptlet.meta.fixable,
        messages: noMultiSpacesInScriptlet.meta.messages,
        schema: noMultiSpacesInScriptlet.meta.schema,
        type: noMultiSpacesInScriptlet.meta.type,
    },

    create(context) {
        return noMultiSpacesInScriptlet.create(context);
    },
};
