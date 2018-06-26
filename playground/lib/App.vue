<template>
    <div class="app">
        <header class="header">
            <div>
                <section class="header-main">
                    <span class="site-title">
                        eslint-plugin-lodash-template playground
                    </span>
                    <span class="sns">
                        <a
                            class="github-button"
                            href="https://github.com/ota-meshi/eslint-plugin-lodash-template"
                            data-show-count="true"
                            aria-label="Star ota-meshi/eslint-plugin-lodash-template on GitHub"
                        >
                            Star
                        </a>
                        <a
                            href="https://twitter.com/share"
                            class="twitter-share-button"
                            data-url="https://ota-meshi.github.io/eslint-plugin-lodash-template/"
                        >
                            Tweet
                        </a>

                        <div
                            class="fb-like"
                            data-href="https://ota-meshi.github.io/eslint-plugin-lodash-template/"
                            data-layout="button_count"
                            data-action="like"
                            data-size="small"
                            data-show-faces="false"
                            data-share="true"
                        />
                        <a
                            href="https://www.npmjs.com/package/eslint-plugin-lodash-template"
                        >
                            <img
                                src="https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg"
                                alt="npm"
                            >
                        </a>
                    </span>
                </section>
                <section>
                    <label class="menu-title">
                        LINKS:
                    </label>
                    <div class="menu-item">
                        <a
                            class="link"
                            href="https://github.com/ota-meshi/eslint-plugin-lodash-template"
                        >
                            <span> View on GitHub </span>
                            <svg
                                version="1.1"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                class="octicon octicon-mark-github"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                                />
                            </svg>
                        </a>
                    </div>
                </section>
            </div>
        </header>
        <div class="main-content">
            <rules-settings
                ref="settings"
                class="rules-settings"
                @change="onChengeRules"
            />
            <eslint-editor
                v-model="code"
                :linter="linter"
                :config="config"
                class="eslint-playground"
                language="html"
                filename="a.html"
                fix
                :postprocess="postprocess"
                :preprocess="preprocess"
                @change="onChange"
            />
            <div class="messages">
                <ol>
                    <li
                        v-for="msg in messages"
                        :key="msg.line + ':' + msg.column + ':' + msg.ruleId"
                        class="message"
                    >
                        [{{ msg.line }}:{{ msg.column }}]: {{ msg.message }} (<a
                            :href="getURL(msg.ruleId)"
                            target="_blank"
                        >
                            {{ msg.ruleId }}
                        </a>)
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script>
import EslintEditor from "vue-eslint-editor"
import Linter from "eslint4b"
import * as coreRules from "eslint4b/dist/core-rules"
import plugin from "../../lib/index.js"
import parser from "../../lib/parser/micro-template-eslint-parser.js"
import processor from "../../lib/processor/micro-template-processor.js"
import RulesSettings from "./RulesSettings.vue"

const ruleURLs = {}
for (const k of Object.keys(plugin.rules)) {
    const rule = plugin.rules[k]
    ruleURLs[rule.meta.docs.ruleId] = rule.meta.docs.url
}
for (const k of Object.keys(coreRules)) {
    const rule = coreRules[k]
    ruleURLs[k] = rule.meta.docs.url
}

const linter = new Linter()

for (const k of Object.keys(plugin.rules)) {
    const rule = plugin.rules[k]
    linter.defineRule(rule.meta.docs.ruleId, rule)
}
linter.defineParser("micro-template-eslint-parser", parser)

// eslint/lib/cli-engine.js #183
function preprocess(rawText) {
    return processor.preprocess(rawText, "a.html")
}

function postprocess(problemLists) {
    return processor.postprocess(problemLists, "a.html")
}

const verifyAndFix = linter.verifyAndFix.bind(linter)
linter.verifyAndFix = function(...args) {
    args[2].preprocess = preprocess
    args[2].postprocess = postprocess
    return verifyAndFix(...args)
}

export default {
    components: { EslintEditor, RulesSettings },
    data() {
        return {
            code: `<% /* global accounts, users */ %>
<% accounts.forEach(({id, profile_image_url, from_user}, i) => { %>
<div id="<%= id %>" class="<%= (i % 2 == 1 ? ' even': '') %>">
  <div class="grid_1 alpha right">
    <img class="righted" src="<%= profile_image_url %>"/>
  </div>
  <div class="grid_6 omega contents">
    <p><b><a href="/<%= from_user %>"><%= from_user %></a>:</b> <%= text %></p>
  </div>
</div>
<% }) %>

<% for ( var i = 0; i < users.length; i++ ) { %>
  <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
<% } %>`,
            config: {
                parser: "micro-template-eslint-parser",
                parserOptions: {
                    ecmaVersion: 2018,
                },
                rules: {},
            },
            linter,
            messages: [],
            preprocess,
            postprocess,
        }
    },
    mounted() {
        ;(function(d, s, id) {
            const [fjs] = d.getElementsByTagName(s)
            if (d.getElementById(id)) {
                return
            }
            const js = d.createElement(s)
            js.id = id
            js.src = "https://buttons.github.io/buttons.js"
            fjs.parentNode.insertBefore(js, fjs)
        })(document, "script", "gh-buttons")
        ;(function(d, s, id) {
            const [fjs] = d.getElementsByTagName(s)
            if (d.getElementById(id)) {
                return
            }
            const js = d.createElement(s)
            js.id = id
            js.src =
                "https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.10"
            fjs.parentNode.insertBefore(js, fjs)
        })(document, "script", "facebook-jssdk")
        ;(function(d, s, id) {
            const [fjs] = d.getElementsByTagName(s)
            const p = /^http:/u.test(d.location) ? "http" : "https"
            if (!d.getElementById(id)) {
                const js = d.createElement(s)
                js.id = id
                js.src = `${p}://platform.twitter.com/widgets.js`
                fjs.parentNode.insertBefore(js, fjs)
            }
        })(document, "script", "twitter-wjs")

        this.reflectConfig()
    },
    methods: {
        onChange({ messages }) {
            this.messages = messages
        },
        onChengeRules() {
            this.reflectConfig()
        },
        getURL(ruleId) {
            return ruleURLs[ruleId] || ""
        },
        reflectConfig() {
            this.config = {
                parser: "micro-template-eslint-parser",
                parserOptions: {
                    ecmaVersion: 2018,
                },
                rules: this.$refs.settings.createRules(),
            }
        },
    },
}
</script>

<style>
html,
body {
    height: 100%;
}
.app {
    height: 100%;
}
.app > .main-content {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 100px);
}
.app > .main-content > .rules-settings {
    height: 100%;
    overflow: auto;
    width: 300px;
    box-sizing: border-box;
}
.app > .main-content > .eslint-playground {
    height: 100%;
    width: calc(100% - 610px);
    box-sizing: border-box;
    border: 1.5px solid gray;
}
.app > .main-content > .messages {
    height: 100%;
    overflow: auto;
    width: 300px;
    box-sizing: border-box;
    font-size: 12px;
}

@media screen and (min-width: 1200px) {
    .app > .main-content > .rules-settings {
        width: 300px;
    }
    .app > .main-content > .eslint-playground {
        width: calc(100% - 610px);
    }
    .app > .main-content > .messages {
        width: 300px;
    }
}
@media screen and (min-width: 768px) and (max-width: 1200px) {
    .app > .main-content > .rules-settings {
        width: 300px;
    }
    .app > .main-content > .eslint-playground {
        width: calc(100% - 310px);
    }
    .app > .main-content > .messages {
        width: 100%;
        height: 300px;
    }
}
@media screen and (max-width: 768px) {
    .app > .main-content > .rules-settings {
        width: 100%;
        height: 300px;
    }
    .app > .main-content > .eslint-playground {
        width: 100%;
    }
    .app > .main-content > .messages {
        width: 100%;
        height: 300px;
    }
}
.header {
    padding: 10px 10px 0 10px;
    background-color: rgb(52, 146, 255);
}
.header * {
    text-decoration: none;
}
.header .site-title {
    color: #fff;
    font-size: 36px;
    vertical-align: bottom;
}
.header-main::after {
    content: "";
    display: block;
    clear: both;
}
.header .link {
    color: #fff;
}
.header .sns {
    padding-left: 5px;
    float: right;
}
.header .sns * {
    vertical-align: top !important;
}
.header .menu-item {
    display: inline-block;
    padding: 5px;
}
.header .octicon {
    fill: #fff;
    vertical-align: text-top;
}
.header .menu-item:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
.header .menu-title {
    color: #ffd;
    padding: 0 0 0 5px;
}
</style>
