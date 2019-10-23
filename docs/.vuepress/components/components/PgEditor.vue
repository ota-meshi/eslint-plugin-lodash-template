<template>
    <eslint-editor
        :code="value"
        :linter="linter"
        :config="config"
        :language="language"
        :filename="fileName"
        fix
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
</template>

<script>
import EslintEditor from "../../../../node_modules/vue-eslint-editor"
import plugin from "../../../.."
import parser from "../../../../lib/parser/micro-template-eslint-parser"
import htmlProcessor from "../../../../lib/processors/html"
import scriptProcessor from "../../../../lib/processors/script"

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
            return !this.script ? "html" : "text"
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
            linter.verifyAndFix = function(...args) {
                args[2].preprocess = vm.preprocess
                args[2].postprocess = vm.postprocess
                return verifyAndFix(...args)
            }
            const verify = linter.verify.bind(linter)
            linter.verify = function(...args) {
                args[2].preprocess = vm.preprocess
                args[2].postprocess = vm.postprocess
                return verify(...args)
            }
            return linter
        },
    },
    async mounted() {
        // Load linter asynchronously.
        const { default: eslint4b } = await import("eslint4b")
        this.eslint4b = eslint4b
    },
    methods: {},
}
</script>

<style scoped></style>
