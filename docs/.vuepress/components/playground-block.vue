<template>
    <div class="app">
        <header class="header">
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
                    />
                </a>
            </span>
        </header>
        <div class="main-content">
            <rules-settings
                ref="settings"
                class="rules-settings"
                :rules.sync="state.rules"
            />
            <div class="editor-content">
                <pg-editor
                    v-model="state.code"
                    :rules="state.rules"
                    class="eslint-playground"
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
                                {{ msg.ruleId }} </a
                            >)
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as coreRules from "../../../node_modules/eslint4b/dist/core-rules"
import plugin from "../../../lib/index.js"
import PgEditor from "./components/PgEditor.vue"
import RulesSettings from "./components/RulesSettings.vue"
import { deserializeState, serializeState } from "./state"
import { DEFAULT_RULES_CONFIG } from "./rules"

const DEFAULT_CODE = `<% /* global accounts, users */ %>
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
<% } %>`

const ruleURLs = {}
for (const k of Object.keys(plugin.rules)) {
    const rule = plugin.rules[k]
    ruleURLs[rule.meta.docs.ruleId] = rule.meta.docs.url
}
for (const k of Object.keys(coreRules)) {
    const rule = coreRules[k]
    ruleURLs[k] = rule.meta.docs.url
}

export default {
    name: 'PlaygroundBlock',
    components: { PgEditor, RulesSettings },
    data() {
        const serializedString = typeof window !== 'undefined' && window.location.hash.slice(1) || ''
        const state = deserializeState(serializedString)
        return {
            serializedString,
            state: {
                code: state.code || DEFAULT_CODE,
                rules: state.rules || Object.assign({}, DEFAULT_RULES_CONFIG),
            },
            messages: [],
        }
    },
    watch: {
        state: {
            handler() {
                this.applyUrlHash()
            },
            deep: true,
        },
    },
    mounted() {
        if (typeof window !== 'undefined') {
          window.addEventListener("hashchange", this.onUrlHashChange)
        }
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
    },
    beforeDestroey() {
        if (typeof window !== 'undefined') {
            window.removeEventListener("hashchange", this.onUrlHashChange)
        }
    },
    methods: {
        onChange({ messages }) {
            this.messages = messages
        },
        getURL(ruleId) {
            return ruleURLs[ruleId] || ""
        },
        onUrlHashChange() {
            const serializedString = typeof window !== 'undefined' && window.location.hash.slice(1) || ''
            if (serializedString !== this.serializedString) {
                this.serializedString = serializedString
                const state = deserializeState(serializedString)
                this.state = {
                    code: state.code || DEFAULT_CODE,
                    rules:
                        state.rules || Object.assign({}, DEFAULT_RULES_CONFIG),
                }
            }
        },
        applyUrlHash() {
            const serializedString = serializeState(this.state)
            if (serializedString !== this.serializedString) {
                this.serializedString = serializedString
                if (typeof window !== 'undefined') {
                    window.location.replace(`#${serializedString}`)
                }
            }
        },
    },
}
</script>

<style>
.theme-container.playground .content:not(.custom) {
    max-width: initial;
    margin: 0 auto;
    padding: 2rem 2.5rem;
}
.theme-container.playground .app {
    height: calc(100vh - 70px);
}
.theme-container.playground .app > .main-content {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 100px);
}
.theme-container.playground .app > .main-content > .rules-settings {
    height: 100%;
    overflow: auto;
    width: 25%;
    box-sizing: border-box;
}
.theme-container.playground .app > .main-content > .editor-content {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.theme-container.playground .app > .main-content > .editor-content > .eslint-playground {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border: 0.5px solid gray;
}
.theme-container.playground .app > .main-content > .editor-content > .messages {
    height: 30%;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    border: 0.5px solid gray;
    padding: 8px;
    font-size: 12px;
}

.theme-container.playground .header {
    padding: 10px 10px 0 10px;
    /* background-color: rgba(52, 146, 255, 0.1); */
}
.theme-container.playground .header * {
    text-decoration: none;
}
.theme-container.playground .header .sns {
    display: flex;
}
.theme-container.playground .header .sns * {
    vertical-align: top !important;
}
</style>
