import eslintJs from "@eslint/js";
import lodashTemplatePlugin from "eslint-plugin-lodash-template";
import stylistic from "@stylistic/eslint-plugin";

export default [
    eslintJs.configs.all,
    lodashTemplatePlugin.configs.all,
    stylistic.configs["all-flat"],

    {
        languageOptions: {
            ecmaVersion: 2018,

            globals: {
                _: true,
            },
        },

        settings: {
            "lodash-template/ignoreRules": ["no-tabs"],
            "lodash-template/globals": ["name"],
        },

        rules: {
            "linebreak-style": "off",
            "max-len": "off",
            "lodash-template/html-indent": "off",
        },
    },

    {
        files: ["*.html"],
        processor: lodashTemplatePlugin.processors.html,
    },
];
