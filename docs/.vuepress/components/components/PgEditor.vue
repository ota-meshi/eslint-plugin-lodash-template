<template>
    <eslint-plugin-lodash-template-editor
        ref="editor"
        :code="value"
        :rules="rules"
        :script="script"
        :ejs="ejs"
        fix
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
</template>

<script>
import EslintPluginLodashTemplateEditor from "./EslintPluginLodashTemplateEditor"

export default {
    name: "PgEditor",
    components: { EslintPluginLodashTemplateEditor },
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
        ejs: {
            type: Boolean,
        },
    },
}
</script>

<style scoped></style>
