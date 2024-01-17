// @ts-check
"use strict";

const sharedContainer = require("../shared-container");
const getConfig = require("./utils/get-config");

/**
 * @typedef {import('../services/micro-template-service')} MicroTemplateService
 */

/**
 * Iterate rule names considering several plugins.
 */
function* iterateRuleNames(...rules) {
    for (const ruleName of rules) {
        yield ruleName;
        yield `@stylistic/${ruleName}`;
        yield `@stylistic/js/${ruleName}`;
        yield `@stylistic/ts/${ruleName}`;
        yield `@typescript-eslint/${ruleName}`;
    }
}

const DISABLED_RULES = [
    ...iterateRuleNames(
        "indent",
        "indent-legacy",
        "strict",
        "no-empty",
        "max-statements-per-line",
        "padded-blocks",
        "no-implicit-globals",
        "no-multi-spaces",
    ),
];

const TEMPLATE_DISABLED_RULES = new Set(
    iterateRuleNames("no-irregular-whitespace"),
);

const TEMPLATE_DELIMITERS_DISABLED_RULES = new Set(
    iterateRuleNames("semi-spacing", "semi", "no-extra-semi", "semi-style"),
);

const TEMPLATE_INTERPOLATE_DISABLED_RULES = new Set(
    iterateRuleNames("no-unused-expressions"),
);

const QUOTE_RULES = new Set(iterateRuleNames("quotes"));

const NO_DEF_RULES = new Set(iterateRuleNames("no-undef"));

const GLOBALS = ["print"];

/**
 * Get the settings
 * @param {string} filename
 */
function getConfigSettingsOptions(filename) {
    let ignoreRules = undefined;
    let globals = undefined;

    const config = getConfig(filename);
    if (config.settings) {
        ignoreRules = config.settings["lodash-template/ignoreRules"];
        globals = config.settings["lodash-template/globals"];
    }

    return {
        ignoreRules,
        globals,
    };
}

/**
 * postprocess for Filter disable rules messages.
 * @param {string} filename The filename.
 * @param {Array} messages The base messages.
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForDisableRules(filename, messages, microTemplateService) {
    const option = getConfigSettingsOptions(filename);
    const ignoreRules = DISABLED_RULES.concat(option.ignoreRules || []);
    const globals = GLOBALS.concat(option.globals || []);

    return messages.filter((message) => {
        if (ignoreRules.includes(message.ruleId)) {
            return false;
        }
        if (
            microTemplateService.inTemplate(message) &&
            TEMPLATE_DISABLED_RULES.has(message.ruleId)
        ) {
            return false;
        }
        if (
            microTemplateService.inInterpolateOrEscape(message) &&
            TEMPLATE_INTERPOLATE_DISABLED_RULES.has(message.ruleId)
        ) {
            return false;
        }
        if (
            microTemplateService.inDelimiterMarks(message) &&
            TEMPLATE_DELIMITERS_DISABLED_RULES.has(message.ruleId)
        ) {
            return false;
        }

        if (NO_DEF_RULES.has(message.ruleId)) {
            if (
                globals
                    .map((g) => `'${g}' is not defined.`)
                    .indexOf(message.message) >= 0
            ) {
                return false;
            }
        }
        if (QUOTE_RULES.has(message.ruleId)) {
            if (message.message === "Strings must use doublequote.") {
                return false;
            }
        }

        return true;
    });
}

/**
 * postprocess for comment-directive
 * @param {Array} messages The base messages.
 * @param {MicroTemplateService} microTemplateService The MicroTemplateService.
 * @returns {Array} messages The processed messages.
 */
function postprocessForEjsCommentDirective(messages, microTemplateService) {
    // Filter messages which are in disabled area.
    return messages.filter(
        (message) => !microTemplateService.isDisableMessageForEjs(message),
    );
}

module.exports = {
    preprocess(code, filename) {
        sharedContainer.register(filename).parseTarget();
        return [code];
    },

    postprocess(messages, filename) {
        const container = sharedContainer.get(filename);
        const microTemplateService =
            container && container.getService(filename);

        sharedContainer.unregister(filename);
        if (!microTemplateService) {
            return [].concat(...messages);
        }

        const resultMessages = messages.map((m) =>
            postprocessForEjsCommentDirective(m, microTemplateService),
        );

        return postprocessForDisableRules(
            filename,
            [].concat(...resultMessages),
            microTemplateService,
        );
    },

    supportsAutofix: true,
};
