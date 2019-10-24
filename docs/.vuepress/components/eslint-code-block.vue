<template>
    <eslint-editor
        ref="editor"
        :linter="linter"
        :config="config"
        :code="code"
        :style="{ height }"
        class="eslint-code-block"
        :language="language"
        :filename="fileName"
        :preprocess="preprocess"
        :postprocess="postprocess"
        dark
        :format="format"
        :fix="fix"
        @input="clearJsMarkers"
        @change="clearJsMarkers"
    />
</template>

<script>
// https://github.com/vuejs/vuepress/issues/451
import EslintEditor from "../../../node_modules/vue-eslint-editor"
import parser from "../../../lib/parser/micro-template-eslint-parser"
import plugin from "../../../"
import htmlProcessor from "../../../lib/processors/html"
import scriptProcessor from "../../../lib/processors/script"
// eslint-disable-next-line @mysticatea/node/no-extraneous-import
import debounce from "lodash/debounce"

export default {
    name: "ESLintCodeBlock",
    components: { EslintEditor },

    props: {
        fix: {
            type: Boolean,
        },
        rules: {
            type: Object,
            default() {
                return {}
            },
        },
        script: {
            type: Boolean,
        },
    },

    data() {
        return {
            eslint4b: null,
            format: {
                insertSpaces: true,
                tabSize: 2,
            },
        }
    },

    computed: {
        config() {
            return {
                globals: {
                    // ES2015 globals
                    ArrayBuffer: false,
                    DataView: false,
                    Float32Array: false,
                    Float64Array: false,
                    Int16Array: false,
                    Int32Array: false,
                    Int8Array: false,
                    Map: false,
                    Promise: false,
                    Proxy: false,
                    Reflect: false,
                    Set: false,
                    Symbol: false,
                    Uint16Array: false,
                    Uint32Array: false,
                    Uint8Array: false,
                    Uint8ClampedArray: false,
                    WeakMap: false,
                    WeakSet: false,
                    // ES2017 globals
                    Atomics: false,
                    SharedArrayBuffer: false,
                },
                rules: this.rules,
                parser: "micro-template-eslint-parser",
                parserOptions: {
                    ecmaVersion: 2019,
                },
            }
        },
        fileName() {
            return !this.script ? "a.html" : "a.js"
        },
        language() {
            return !this.script ? "html" : "javascript"
        },
        preprocess() {
            const script = this.script
            if (!script) {
                return rawText =>
                    htmlProcessor.preprocess(rawText, this.fileName)
            }
            return rawText => scriptProcessor.preprocess(rawText, this.fileName)
        },
        postprocess() {
            const script = this.script
            if (!script) {
                return problemLists =>
                    htmlProcessor.postprocess(problemLists, this.fileName)
            }
            return problemLists =>
                scriptProcessor.postprocess(problemLists, this.fileName)
        },
        linter() {
            if (!this.eslint4b) {
                return null
            }
            const Linter = this.eslint4b

            const linter = new Linter()

            for (const k of Object.keys(plugin.rules)) {
                const rule = plugin.rules[k]
                linter.defineRule(rule.meta.docs.ruleId, rule)
            }
            linter.defineParser("micro-template-eslint-parser", parser)

            const vm = this
            // verifyAndFixだけpreprocess・postprocessをサポートしていない様子
            const verifyAndFix = linter.verifyAndFix.bind(linter)
            linter.verifyAndFix = function(...args) {
                args[2].preprocess = vm.preprocess
                args[2].postprocess = vm.postprocess
                return verifyAndFix(...args)
            }
            return linter
        },

        code() {
            return `${this.computeCodeFromSlot(this.$slots.default).trim()}\n`
        },

        height() {
            const lines = this.code.split("\n").length
            return `${Math.max(120, 20 * (1 + lines))}px`
        },
    },

    async mounted() {
        // Load linter asynchronously.
        const { default: eslint4b } = await import("eslint4b")
        this.eslint4b = eslint4b

        this.clearJsMarkersCycle = debounce(this.clearJsMarkersCycle, 100)
        this.$on("clearJsMarkersCycle", this.clearJsMarkersCycle)

        this.$refs.editor.$watch("monaco", () => {
            const { monaco } = this.$refs.editor
            // monaco.languages.j()
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                { validate: false }
            )
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                { validate: false }
            )
        })
    },

    methods: {
        computeCodeFromSlot(nodes) {
            if (!Array.isArray(nodes)) {
                return ""
            }
            return nodes
                .map(
                    node => node.text || this.computeCodeFromSlot(node.children)
                )
                .join("")
        },

        clearJsMarkers() {
            this._clearJsMarkersCycleCount = 0
            this.clearJsMarkersCycle()
        },

        clearJsMarkersCycle() {
            setTimeout(() => {
                this._clearJsMarkersCycleCount++
                if (this._clearJsMarkersCycleCount > 10) {
                    return
                }
                if (this.$refs.editor) {
                    const editors = [
                        this.$refs.editor.codeEditor,
                        this.$refs.editor.fixedCodeEditor,
                    ]
                    let cleared = 0
                    for (const editor of editors.filter(e => e)) {
                        const { monaco } = this.$refs.editor
                        const model = editor.getModel()
                        if (
                            monaco.editor
                                .getModelMarkers({ resource: model.uri })
                                .some(e => e.owner === "javascript")
                        ) {
                            cleared++
                        }
                        monaco.editor.setModelMarkers(model, "javascript", [])
                    }
                    if (cleared) {
                        return
                    }
                }
                this.$emit("clearJsMarkersCycle")
            }, 200)
        },
    },
}
</script>

<style>
.eslint-code-block {
    width: 100%;
    margin: 1em 0;
}
</style>
