import eslintJs from "@eslint/js";
import eslintPluginLodashTemplate from "eslint-plugin-lodash-template";
import stylistic from "@stylistic/eslint-plugin";

export default [
    eslintJs.configs.all,
    eslintPluginLodashTemplate.configs.base,
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
            parserOptions: {
                templateSettings: {
                    evaluate: "(?:(?:<%_)|(?:<%(?!%)))([\\s\\S]*?)[_\\-]?%>",
                    interpolate: "<%-([\\s\\S]*?)[_\\-]?%>",
                    escape: "<%=([\\s\\S]*?)[_\\-]?%>",
                },
            },
        },
        processor: eslintPluginLodashTemplate.processors.html,
    },
    {
        files: ["*.ejs"],
        ...eslintPluginLodashTemplate.configs.base,
    },
];
