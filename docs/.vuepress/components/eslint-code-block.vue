<template>
    <eslint-plugin-editor
        ref="editor"
        v-model="code"
        :style="{ height }"
        :rules="rules"
        dark
        :fix="fix"
        :script="script"
    />
</template>

<script>
import EslintPluginEditor from "./components/EslintPluginEditor"

export default {
    name: "ESLintCodeBlock",
    components: { EslintPluginEditor },
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
            code: "",
            height: "",
        }
    },
    mounted() {
        this.code = `${this.computeCodeFromSlot(this.$slots.default).trim()}\n`
        const lines = this.code.split("\n").length
        this.height = `${Math.max(120, 20 * (1 + lines))}px`
    },

    methods: {
        /**
         * @param {VNode[]} nodes
         * @returns {string}
         */
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
