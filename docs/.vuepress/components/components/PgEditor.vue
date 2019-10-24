<template>
    <eslint-editor
        ref="editor"
        :code="value"
        :linter="linter"
        :config="config"
        :language="language"
        :filename="fileName"
        :preprocess="preprocess"
        :postprocess="postprocess"
        fix
        @input="onInput"
        @change="onChange"
    />
</template>

<script>
import EslintEditor from "../../../../node_modules/vue-eslint-editor"
import plugin from "../../../.."
import parser from "../../../../lib/parser/micro-template-eslint-parser"
import htmlProcessor from "../../../../lib/processors/html"
import scriptProcessor from "../../../../lib/processors/script"
// eslint-disable-next-line @mysticatea/node/no-extraneous-import
import debounce from "lodash/debounce"

export default {
    name: "PgEditor",
    components: { EslintEditor },
    props: {
        value: {
            type: String,
            default: "",
        },
        rules: {
            type: Object,
            default: () => ({}),
        },
        messages: {
            type: Array,
            default: () => [],
        },
        script: {
            type: Boolean,
        },
    },
    data() {
        return {
            eslint4b: null,
        }
    },
    computed: {
        config() {
            return {
                parser: "micro-template-eslint-parser",
                parserOptions: {
                    ecmaVersion: 2018,
                },
                rules: this.rules,
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
            const verifyAndFix = linter.verifyAndFix.bind(linter)
            // verifyAndFixだけpreprocess・postprocessをサポートしていない様子
            linter.verifyAndFix = function(...args) {
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
        onInput($event) {
            this.$emit("input", $event)
            this.clearJsMarkers()
        },
        onChange($event) {
            this.$emit("change", $event)
            this.clearJsMarkers()
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

<style scoped></style>
