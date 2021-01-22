<template>
    <eslint-plugin-lodash-template-editor
        ref="editor"
        :code="code"
        :style="{ height }"
        :rules="rules"
        dark
        :fix="fix"
        :script="script"
    />
</template>

<script>
import EslintPluginLodashTemplateEditor from "./components/EslintPluginLodashTemplateEditor"

export default {
    name: "ESLintCodeBlock",
    components: { EslintPluginLodashTemplateEditor },
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

    computed: {
        code() {
            return `${this.computeCodeFromSlot(this.$slots.default).trim()}\n`
        },

        height() {
            const lines = this.code.split("\n").length
            return `${Math.max(120, 20 * (1 + lines))}px`
        },
    },

    methods: {
        computeCodeFromSlot(nodes) {
            if (!Array.isArray(nodes)) {
                return ""
            }
            return nodes
                .map(
                    (node) =>
                        node.text || this.computeCodeFromSlot(node.children),
                )
                .join("")
        },
    },
}
</script>
