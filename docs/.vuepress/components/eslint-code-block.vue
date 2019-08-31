<template>
  <eslint-editor
    :linter="linter"
    :config="config"
    :code="code"
    :style="{ height }"
    class="eslint-code-block"
    filename="example.html"
    language="html"
    :preprocess="preprocess"
    :postprocess="postprocess"
    dark
    :format="format"
    :fix="fix"
  />
</template>

<script>
// https://github.com/vuejs/vuepress/issues/451
import EslintEditor from '../../../node_modules/vue-eslint-editor'
import parser from "../../../lib/parser/micro-template-eslint-parser"
import plugin from '../../../'
import processor from "../../../lib/processors/html"


function preprocess(rawText) {
    return processor.preprocess(rawText, "a.html")
}

function postprocess(problemLists) {
    return processor.postprocess(problemLists, "a.html")
}

export default {
  name: 'ESLintCodeBlock',
  components: { EslintEditor },

  props: {
    fix: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      linter: null,
      preprocess,
      postprocess,
      format: {
        insertSpaces: true,
        tabSize: 2
      }
    }
  },

  computed: {
    config () {
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
          SharedArrayBuffer: false
        },
        rules: this.rules,
        parser: 'micro-template-eslint-parser',
        parserOptions: {
          ecmaVersion: 2019
        }
      }
    },

    code () {
      return `${this.computeCodeFromSlot(this.$slots.default).trim()}\n`
    },

    height () {
      const lines = this.code.split('\n').length
      return `${Math.max(120, 20 * (1 + lines))}px`
    }
  },

  methods: {
    computeCodeFromSlot (nodes) {
      if (!Array.isArray(nodes)) {
        return ''
      }
      return nodes.map(node =>
        node.text || this.computeCodeFromSlot(node.children)
      ).join('')
    }
  },

  async mounted () {
    // Load linter.
    const { default: Linter } = await import('eslint4b/dist/linter')

    const linter = (this.linter = new Linter())

    for (const k of Object.keys(plugin.rules)) {
        const rule = plugin.rules[k]
        linter.defineRule(rule.meta.docs.ruleId, rule)
    }

    linter.defineParser("micro-template-eslint-parser", parser)
  }
}
</script>

<style>
.eslint-code-block {
  width: 100%;
  margin: 1em 0;
}
</style>
