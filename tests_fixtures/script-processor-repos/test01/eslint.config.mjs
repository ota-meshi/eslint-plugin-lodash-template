import eslintJs from "@eslint/js";
import globals from "globals";
import lodashTemplatePlugin from "eslint-plugin-lodash-template";

export default [
    eslintJs.configs.all,
    lodashTemplatePlugin.configs.recommendedWithScript,
    lodashTemplatePlugin.configs.all,

    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",

            globals: {
                ...globals.browser,
                ...globals.es6,
            },
        },
    },
];
