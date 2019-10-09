"use strict"

/**
 * Message to string
 * @param {*} message message
 */
function messageToString(message) {
    return `${message.ruleId}:${message.line}:${message.column}:${message.endLine}:${message.endColumn}`
}

module.exports = {
    /**
     * Filter duplicate messages.
     * @param {Array<Array>} messages The base messages.
     * @returns {Array} messages The filtered messages.
     */
    filterDuplicateMessages(messages) {
        const dup = new Set()
        for (const message of messages[0]) {
            const key = messageToString(message)
            dup.add(key)
        }
        const results = [messages[0]]
        for (const msgs of messages.slice(1)) {
            const result = []
            for (const message of msgs) {
                const key = messageToString(message)
                if (!dup.has(key)) {
                    result.push(message)
                    dup.add(key)
                }
            }
            results.push(result)
        }
        return results
    },
}
