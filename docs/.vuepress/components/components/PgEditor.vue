<template>
    <eslint-editor
        :code="value"
        :linter="linter"
        :config="config"
        language="html"
        filename="a.html"
        fix
        :postprocess="postprocess"
        :preprocess="preprocess"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
</template>

<script>
import EslintEditor from "../../../../node_modules/vue-eslint-editor"
import plugin from "../../../.."
import parser from "../../../../lib/parser/micro-template-eslint-parser"
import processor from "../../../../lib/processors/html"

// eslint/lib/cli-engine.js #183
function preprocess(rawText) {
    return processor.preprocess(rawText, "a.html")
}

function postprocess(problemLists) {
    return processor.postprocess(problemLists, "a.html")
}

export default {
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
    },
    data() {
        return {
            eslint4b: null,
            preprocess,
            postprocess,
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

            const verifyAndFix = linter.verifyAndFix.bind(linter)
            linter.verifyAndFix = function(...args) {
                args[2].preprocess = preprocess
                args[2].postprocess = postprocess
                return verifyAndFix(...args)
            }
            const verify = linter.verify.bind(linter)
            linter.verify = function(...args) {
                args[2].preprocess = preprocess
                args[2].postprocess = postprocess
                return verify(...args)
            }
            return linter
        }
    },
    async mounted() {
        // Load linter asynchronously.
        const { default: eslint4b } = await import("eslint4b")
        this.eslint4b = eslint4b
    },
}
</script>

<style scoped></style>
