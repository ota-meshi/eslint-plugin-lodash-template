<template>
    <div class="rules-settings">
        <ul class="categories">
            <li
                v-for="category in categories"
                :key="category.title"
                class="category"
            >
                <div class="category-title-wrapper">
                    <a href="javascript:void(0);" @click="onAllCheck(category)">
                        <i class="material-icons"> check_box </i> </a
                    ><a
                        href="javascript:void(0);"
                        @click="onAllUncheck(category)"
                    >
                        <i class="material-icons"> check_box_outline_blank </i>
                    </a>
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
                        <a :href="rule.url" target="_blank">
                            <i class="material-icons"> open_in_new </i>
                        </a>
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
