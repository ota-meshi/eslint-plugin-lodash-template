"use strict"

class Condition {
    /**
     * @param {Expression} node
     * @param {string} scriptText
     * @returns {Condition}
     */
    static create(node, scriptText) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            const not = Condition.create(node.argument, scriptText)
            return not.not
        }
        // eslint-disable-next-line no-use-before-define -- ignore
        return new ConditionForNode(node, scriptText)
    }

    /**
     * @param {string} text
     * @param {Condition | ((c: Condition) => string)} not
     */
    constructor(text, not) {
        this.text = text
        if (typeof not === "function") {
            this._getNotText = not
        } else {
            this._not = not
        }
    }

    get not() {
        if (this._not) {
            return this._not
        }
        return (this._not = new Condition(this._getNotText(this), this))
    }
}
class ConditionForNode extends Condition {
    /**
     * @param {Expression} node
     * @param {string} scriptText
     * @returns {Condition}
     */
    constructor(node, scriptText) {
        super(getTextFromNode(node), (condition) => {
            if (node.type === "BinaryExpression") {
                const op =
                    node.operator === "!=" || node.operator === "!=="
                        ? `=${node.operator.slice(1)}`
                        : node.operator === "==" || node.operator === "==="
                        ? `!${node.operator.slice(1)}`
                        : node.operator === "<"
                        ? ">="
                        : node.operator === "<="
                        ? ">"
                        : node.operator === ">="
                        ? "<"
                        : node.operator === ">"
                        ? "<="
                        : null
                if (op) {
                    return `${getTextFromNode(node.left)}${op}${getTextFromNode(
                        node.right,
                    )}`
                }
            }

            return `!(${condition.text})`
        })

        /**
         * Get text from node
         */
        function getTextFromNode(n) {
            return scriptText.slice(...n.range).replace(/\s/gu, "")
        }
    }
}

module.exports = { Condition }
