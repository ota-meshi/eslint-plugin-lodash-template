<template>
    <div class="rules-settings">
        <ul class="categories">
            <li
                v-for="category in categories"
                :key="category.title"
                class="category"
            >
                <label class="category-title">
                    {{ category.title }}
                </label>
                <a href="javascript:void(0);" @click="onAllCheck(category)">
                    check all
                </a>
                <ul class="rules">
                    <li
                        v-for="rule in category.rules"
                        :key="rule.ruleId"
                        class="rule"
                    >
                        <label>
                            <input
                                v-model="rule.checked"
                                :value="rule.ruleId"
                                type="checkbox"
                                @change="$emit('change')"
                            >
                            {{ rule.ruleId }}
                        </label>
                        <a :href="rule.url" target="_blank">
                            <i class="material-icons">
                                open_in_new
                            </i>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import * as coreRules from "eslint4b/dist/core-rules"
import plugin from "../../lib/index.js"

const CATEGORY_TITLES = {
    base: "Base Rules",
    "best-practices": "Best Practices (Improve Development Experience)",
    recommended: "Recommended (Improve Readability)",
    "recommended-with-html":
        "Recommended with HTML template (Improve Readability with HTML template)",
    uncategorized: "Uncategorized",
    "eslint-core-rules@Possible Errors": "ESLint core rules(Possible Errors)",
    "eslint-core-rules@Best Practices": "ESLint core rules(Best Practices)",
    "eslint-core-rules@Strict Mode": "ESLint core rules(Strict Mode)",
    "eslint-core-rules@Variables": "ESLint core rules(Variables)",
    "eslint-core-rules@Node.js and CommonJS":
        "ESLint core rules(Node.js and CommonJS)",
    "eslint-core-rules@Stylistic Issues": "ESLint core rules(Stylistic Issues)",
    "eslint-core-rules@ECMAScript 6": "ESLint core rules(ECMAScript 6)",
}
const CATEGORY_INDEX = {
    base: 0,
    "best-practices": 1,
    recommended: 2,
    "recommended-with-html": 3,
    uncategorized: 4,
    "eslint-core-rules@Possible Errors": 5,
    "eslint-core-rules@Best Practices": 6,
    "eslint-core-rules@Strict Mode": 7,
    "eslint-core-rules@Variables": 8,
    "eslint-core-rules@Node.js and CommonJS": 9,
    "eslint-core-rules@Stylistic Issues": 10,
    "eslint-core-rules@ECMAScript 6": 11,
}

const rules = []

for (const k of Object.keys(plugin.rules)) {
    const rule = plugin.rules[k]
    rule.meta.docs.category = rule.meta.docs.category || "uncategorized"
    rules.push({
        category: rule.meta.docs.category,
        ruleId: rule.meta.docs.ruleId,
        url: rule.meta.docs.url,
        checked: CATEGORY_INDEX[rule.meta.docs.category] <= 3,
    })
}
for (const k of Object.keys(coreRules)) {
    const rule = coreRules[k]
    rules.push({
        category: `eslint-core-rules@${rule.meta.docs.category}`,
        fallbackTitle: `ESLint core rules(${rule.meta.docs.category})`,
        ruleId: k,
        url: rule.meta.docs.url,
        checked: rule.meta.docs.recommended,
    })
}

rules.sort((a, b) => (a.ruleId > b.ruleId ? 1 : a.ruleId < b.ruleId ? -1 : 0))

const categories = []

for (const rule of rules) {
    const title = CATEGORY_TITLES[rule.category] || rule.fallbackTitle
    let category = categories.find(c => c.title === title)
    if (!category) {
        category = {
            category: rule.category,
            categoryOrder: CATEGORY_INDEX[rule.category],
            title,
            rules: [],
        }
        categories.push(category)
    }
    category.rules.push(rule)
}
categories.sort((a, b) =>
    a.categoryOrder > b.categoryOrder
        ? 1
        : a.categoryOrder < b.categoryOrder
        ? -1
        : a.title > b.title
        ? 1
        : a.title < b.title
        ? -1
        : 0
)

export default {
    data() {
        return {
            categories,
        }
    },
    methods: {
        createRules() {
            return rules.reduce((c, r) => {
                c[r.ruleId] = r.checked ? "error" : "off"
                return c
            }, {})
        },
        onAllCheck(category) {
            for (const rule of category.rules) {
                rule.checked = true
            }
            this.$emit("change")
            this.$forceUpdate()
        },
    },
}
</script>

<style>
.category-title {
    font-weight: bold;
}
.rules {
    padding-left: 0;
}
.rule {
    line-height: 24px;
    vertical-align: top;
    list-style-type: none;
    display: flex;
}
.rule a {
    margin-left: auto;
}
.rule .material-icons {
    vertical-align: middle;
    font-size: 16px;
}
</style>
