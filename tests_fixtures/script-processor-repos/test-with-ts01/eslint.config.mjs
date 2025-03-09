import eslintJs from "@eslint/js";
import lodashTemplatePlugin from "eslint-plugin-lodash-template";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
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

    {
        files: ["**/*.ts"],
        extends: [
            eslintJs.configs.all,
            lodashTemplatePlugin.configs.recommendedWithScript,
            lodashTemplatePlugin.configs.all,
        ],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
);
