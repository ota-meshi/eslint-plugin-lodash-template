<template>
    <div class="rules-settings">
        <ul class="categories">
            <li
                v-for="category in categories"
                :key="category.title"
                class="category"
            >
                <div class="category-title-wrapper">
                    <a href="javascript:void(0);" @click="onAllCheck(category)"
                    >✅</a>
                    <a
                        href="javascript:void(0);"
                        @click="onAllUncheck(category)"
                    >❎</a>
                    <label class="category-title"> {{ category.title }} </label>
                </div>

                <ul class="rules">
                    <li
                        v-for="rule in category.rules"
                        :key="rule.ruleId"
                        class="rule"
                    >
                        <label>
                            <input
                                :checked="
                                    rules[rule.ruleId] === 'error' ||
                                        rules[rule.ruleId] === 2
                                "
                                type="checkbox"
                                @input="onClick(rule.ruleId, $event)"
                            />
                            {{ rule.ruleId }}
                        </label>
                        <a :href="rule.url" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { categories } from "../rules"

export default {
    props: {
        rules: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            categories,
        }
    },
    watch: {},
    methods: {
        onAllCheck(category) {
            const rules = Object.assign({}, this.rules)
            for (const rule of category.rules) {
                rules[rule.ruleId] = "error"
            }
            this.$emit("update:rules", rules)
        },
        onAllUncheck(category) {
            const rules = Object.assign({}, this.rules)
            for (const rule of category.rules) {
                delete rules[rule.ruleId]
            }
            this.$emit("update:rules", rules)
        },
        onClick(ruleId, e) {
            const rules = Object.assign({}, this.rules)
            if (e.target.checked) {
                rules[ruleId] = "error"
            } else {
                delete rules[ruleId]
            }
            this.$emit("update:rules", rules)
        },
    },
}
</script>

<style scoped>
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
.material-icons {
    vertical-align: middle;
    font-size: 16px;
}
.category-title-wrapper .material-icons {
    display: none;
}
.category-title-wrapper:hover .material-icons {
    display: inline;
}
a {
    text-decoration: none;
}
</style>
