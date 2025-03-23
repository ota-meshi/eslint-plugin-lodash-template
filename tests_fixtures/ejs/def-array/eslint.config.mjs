import eslintPluginLodashTemplate from "eslint-plugin-lodash-template";
import stylistic from "@stylistic/eslint-plugin";
import eslintJs from "@eslint/js";

export default [
    eslintJs.configs.all,
    eslintPluginLodashTemplate.configs.all,
    stylistic.configs["all-flat"],

    {
        languageOptions: {
            ecmaVersion: 2018,
        },
    },

    {
        files: ["*.ejs"],
        languageOptions: {
            globals: {
                include: true,
            },
        },
        processor: eslintPluginLodashTemplate.processors.html,
    },
    {
        files: ["*.ejs"],
        ...eslintPluginLodashTemplate.configs.baseWithEjs,
    },
];
