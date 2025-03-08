import eslintPluginLodashTemplate from "eslint-plugin-lodash-template";
import eslintPluginOtaMeshi from "@ota-meshi/eslint-plugin";
import eslintPluginEs from "eslint-plugin-es";
import vueEslintParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        languageOptions: {
            sourceType: "script",
            ecmaVersion: 2020,
        },
        plugins: {
            es: eslintPluginEs,
        },
        rules: {
            "jsdoc/require-jsdoc": "error",
            "no-warning-comments": "warn",
            "regexp/no-obscure-range": ["error", { allowed: "all" }],
        },
    },

    eslintPluginLodashTemplate.configs["flat/all"],
    eslintPluginOtaMeshi.config({
        node: true,
        packageJson: true,
        eslintPlugin: true,
        json: true,
        yaml: true,
        // md: true,
        prettier: true,
    }),

    {
        files: ["lib/rules/**/*.js"],
        rules: {
            "eslint-plugin/require-meta-docs-description": [
                "error",
                { pattern: "^(enforce|require|disallow|prefer)" },
            ],
            "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
            "eslint-plugin/require-meta-docs-url": [
                "error",
                {
                    pattern:
                        "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/{{name}}.html",
                },
            ],
        },
    },

    {
        files: ["scripts/*.js"],
        rules: {
            "jsdoc/require-jsdoc": "off",
        },
    },

    {
        files: ["docs/.vitepress/**"],
        extends: [
            eslintPluginOtaMeshi.config({
                vue3: true,
                prettier: true,
            }),
        ],
        languageOptions: {
            parser: vueEslintParser,
            sourceType: "module",
            ecmaVersion: 2020,
            globals: {
                window: "readonly",
            },
        },
        rules: {
            "jsdoc/require-jsdoc": "off",
            "@mysticatea/node/no-missing-import": "off",
            "@mysticatea/vue/html-closing-bracket-newline": "off",
            "@mysticatea/vue/max-attributes-per-line": "off",
            "@mysticatea/vue/comma-dangle": "off",
            "@mysticatea/vue/html-indent": "off",
            "@mysticatea/vue/html-self-closing": "off",
            "@mysticatea/node/file-extension-in-import": "off",
            "@mysticatea/node/no-unsupported-features/es-syntax": "off",
        },
    },

    {
        files: ["docs/.vitepress/**/*.mts", "docs/.vitepress/**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
        },
        extends: [
            eslintPluginOtaMeshi.config({
                ts: true,
            }),
            tseslint.configs.disableTypeChecked,
        ],
    },

    {
        ignores: [
            ".nyc_output/**",
            "coverage/**",
            "node_modules/**",
            "playground/node_modules/**",
            "assets/**",
            "samples/**",
            "tests_fixtures/**",
            "docs/.vitepress/dist/**",
            "docs/.vitepress/cache/**",
        ],
    },
);
