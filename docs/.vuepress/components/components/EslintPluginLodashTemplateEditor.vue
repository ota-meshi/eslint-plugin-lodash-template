<template>
    <eslint-editor
        ref="editor"
        :linter="linter"
        :config="config"
        :code="code"
        class="eslint-code-block"
        :language="language"
        :filename="fileName"
        :preprocess="preprocess"
        :postprocess="postprocess"
        :dark="dark"
        :format="format"
        :fix="fix"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
</template>

<script>
import EslintEditor from "vue-eslint-editor"
import parser from "../../../../lib/parser/micro-template-eslint-parser"
import plugin from "../../../../"
import htmlProcessor from "../../../../lib/processors/html"
import scriptProcessor from "../../../../lib/processors/script"

export default {
    name: "EslintPluginLodashTemplateEditor",
    components: { EslintEditor },
    model: {
        prop: "code",
    },
    props: {
        code: {
            type: String,
            default: "",
        },
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
        ejs: {
            type: Boolean,
        },
        dark: {
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
                    sourceType: "module",
                    ecmaVersion: 2019,
                    ...(this.ejs
                        ? {
                              templateSettings: {
                                  evaluate: [
                                      ["<%", "<%_"],
                                      ["%>", "-%>", "_%>"],
                                  ],
                                  interpolate: ["<%-", ["%>", "-%>", "_%>"]],
                                  escape: ["<%=", ["%>", "-%>", "_%>"]],
                                  comment: ["<%#", ["%>", "-%>", "_%>"]],
                                  literal: ["<%%"],
                              },
                          }
                        : {}),
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
                return (rawText) =>
                    htmlProcessor.preprocess(rawText, this.fileName)
            }
            return (rawText) =>
                scriptProcessor.preprocess(rawText, this.fileName)
        },
        postprocess() {
            const script = this.script
            if (!script) {
                return (problemLists) =>
                    htmlProcessor.postprocess(problemLists, this.fileName)
            }
            return (problemLists) =>
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
            linter.verifyAndFix = function (...args) {
                args[2].preprocess = vm.preprocess
                args[2].postprocess = vm.postprocess
                return verifyAndFix(...args)
            }
            return linter
        },
    },

    async mounted() {
        // Load linter asynchronously.
        const { default: eslint4b } = await import("eslint4b")
        this.eslint4b = eslint4b

        const editor = this.$refs.editor

        editor.$watch("monaco", () => {
            const { monaco } = editor
            // monaco.languages.j()
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                { validate: false },
            )
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                { validate: false },
            )
        })
        editor.$watch("codeEditor", () => {
            if (editor.codeEditor) {
                editor.codeEditor.onDidChangeModelDecorations(() =>
                    this.onDidChangeModelDecorations(editor.codeEditor),
                )
            }
        })
        editor.$watch("fixedCodeEditor", () => {
            if (editor.fixedCodeEditor) {
                editor.fixedCodeEditor.onDidChangeModelDecorations(() =>
                    this.onDidChangeModelDecorations(editor.fixedCodeEditor),
                )
            }
        })
    },

    methods: {
        onDidChangeModelDecorations(editor) {
            const { monaco } = this.$refs.editor
            const model = editor.getModel()
            monaco.editor.setModelMarkers(model, "javascript", [])
        },
    },
}
</script>

<style scoped>
.eslint-code-block {
    width: 100%;
    margin: 1em 0;
}
</style>
