import type { DefaultTheme, UserConfig } from "vitepress";
import { defineConfig } from "vitepress";
import path from "path";
import { fileURLToPath } from "url";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { createTwoslasher as createTwoslasherESLint } from "twoslash-eslint";

type RuleModule = {
    meta: { docs: { ruleId: string; ruleName: string }; deprecated?: boolean };
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function ruleToSidebarItem({
    meta: {
        docs: { ruleId, ruleName },
    },
}: RuleModule): DefaultTheme.SidebarItem {
    return {
        text: ruleId,
        link: `/rules/${ruleName}`,
    };
}

export default async (): Promise<UserConfig<DefaultTheme.Config>> => {
    const rulesPath = path.join(dirname, "../../lib/utils/rules.js");
    const { rules } = await import(rulesPath).then((m) => m.default || m);
    const pluginPath = path.join(dirname, "../../lib/index.js");
    const plugin = await import(pluginPath).then((m) => m.default || m);
    return defineConfig({
        base: "/eslint-plugin-lodash-template/",
        title: "eslint-plugin-lodash-template",
        outDir: path.join(dirname, "./dist/eslint-plugin-lodash-template"),
        description:
            "ESLint plugin for John Resig-style micro template, Lodash's template, Underscore's template and EJS.",
        head: [],
        lastUpdated: true,
        vite: {
            publicDir: path.resolve(dirname, "./public"),
        },
        markdown: {
            codeTransformers: [
                transformerTwoslash({
                    explicitTrigger: false, // Required for v-menu to work.
                    langs: ["html", "js"],
                    filter(lang, code) {
                        if (lang.startsWith("html") || lang.startsWith("js")) {
                            return code.includes("eslint");
                        }
                        return false;
                    },
                    errorRendering: "hover",
                    twoslasher: createTwoslasherESLint({
                        eslintConfig: [
                            {
                                files: ["*", "**/*"],
                                plugins: {
                                    "lodash-template": plugin,
                                },
                                languageOptions: {
                                    parser: plugin.parser,
                                },
                            },
                            {
                                files: ["*.js", "**/*.js"],
                                processor: "lodash-template/script",
                                rules: {
                                    "lodash-template/no-script-parsing-error":
                                        "error",
                                },
                            },
                            {
                                files: ["*.html", "**/*.html"],
                                processor: "lodash-template/html",
                            },
                        ],
                    }),
                }),
            ],
        },
        themeConfig: {
            siteTitle: "eslint-plugin-lodash-template",
            search: {
                provider: "local",
                options: {
                    detailedView: true,
                },
            },
            editLink: {
                pattern:
                    "https://github.com/ota-meshi/eslint-plugin-lodash-template/edit/master/docs/:path",
            },
            nav: [
                { text: "User Guide", link: "/" },
                { text: "Rules", link: "/rules/" },
                {
                    text: "Playground",
                    link: "https://eslint-online-playground.netlify.app/#eNqNUk2P2jAQ/SujSIiPDUm3hx7SQC/tuZeqlw1CxhkSbx3bsg2lQvz3jp2EAtVKqxxizbx5783HOXGW53hinZGYtb6TSZGUE8gX0Ei9YxIY5/qgvEvh4NA6WOQwWVeKMGMm22v7jfF2NjuLOgVj9V5I3IqONbg9WJnC3upuG8ovKYg5rNZwjiQAZS2OIOpVRaIreoRwAlwy54bYTMAEPsJqBc/wBaaAR1TTAqbTecRGloFnLGusqLfPwKRpGVjRtP6KI6TomisyJrEmSRrDIPif/6iTj0I5Kb0p+gl0hw0DrpVHGs2trlmXu3XJoLW4J3wetK6D6Xt5DJU5WxdlvltDyHg8+Rg0j17GBy3lEsei4pv2AjM4MgsCVvDhM/3KfouZRNX4liJPTzD/tw0pbhwGzYh+EZtsnEP0eI0q1uHgs8ypuLcQ2ZI0ydBJobzl2aujs+p0faAjw5PR1jtydCafoSlUtSvgpUp6fGGR666jaNhMClVi5KERqpC6Zq5deqRjZR7zG9zyt/DtMtxvlWzSwGuYJZffjRdaEXvUIjXesZ9knoIFEQcaR9cRKyrv9MFy/PHHYEj2fqsk5C4RoY9oac0Y3caKgbby4WT6JhYZvtLiexfho4Pi6Jy2UfGhh95yD+1F3iC957yd2nun47gVhprdDGrhR+8Lbcow/ouunUS0ok2RASCvNR6/ogkMigsk/TjGcHnjqkLoboq3yWVvbPlg7L4mlJCTS3L5C/4egQw=",
                },
            ],
            socialLinks: [
                {
                    icon: "github",
                    link: "https://github.com/ota-meshi/eslint-plugin-lodash-template",
                },
            ],
            sidebar: {
                "/rules/": [
                    {
                        text: "Rules",
                        items: [{ text: "Available Rules", link: "/rules/" }],
                    },
                    {
                        text: "Node.js Dependency Rules",
                        collapsed: false,
                        items: rules
                            .filter((rule) => !rule.meta.deprecated)
                            .map(ruleToSidebarItem),
                    },

                    // Rules in no category.
                    // eslint-disable-next-line no-extra-parens -- false positive ?
                    ...(rules.some((rule) => rule.meta.deprecated)
                        ? [
                              {
                                  text: "Deprecated",
                                  collapsed: false,
                                  items: rules
                                      .filter((rule) => rule.meta.deprecated)
                                      .map(ruleToSidebarItem),
                              },
                          ]
                        : []),
                ],
                "/": [
                    {
                        text: "Guide",
                        items: [
                            { text: "User Guide", link: "/" },
                            { text: "Rules", link: "/rules/" },
                        ],
                    },
                    {
                        text: "Contributing",
                        link: "/services/",
                    },
                    {
                        text: "Migrations",
                        items: [
                            {
                                text: "0.13.x to 0.14.x",
                                link: "/migration/0.13to0.14.html",
                            },
                        ],
                    },
                ],
            },
        },
    });
};
