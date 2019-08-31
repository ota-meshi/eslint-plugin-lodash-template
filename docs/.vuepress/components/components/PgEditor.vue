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
            linter: null,
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
    },
    async mounted() {
        // Load linter asynchronously.
        const { default: Linter } = await import("eslint4b")

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
        this.linter = linter
    },
}
</script>

<style scoped></style>
