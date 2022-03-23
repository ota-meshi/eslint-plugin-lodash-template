"use strict"

const fs = require("fs")
const path = require("path")

/**
 * list up files
 * @param {*} dirpath
 */
function listupFiles(dirpath) {
    const results = []
    for (const name of fs.readdirSync(dirpath)) {
        const filepath = path.join(dirpath, name)
        if (fs.statSync(filepath).isDirectory()) {
            results.push(
                ...listupFiles(filepath).map((n) => path.join(name, n)),
            )
        } else {
            results.push(name)
        }
    }
    return results
}

module.exports = {
    isUpdateMode() {
        // eslint-disable-next-line no-process-env -- test
        return Boolean(process.env.UPDATE_FIXTURE)
    },
    writeFile(expectFilepath, content) {
        // eslint-disable-next-line no-process-env -- test
        if (process.env.UPDATE_FIXTURE || !fs.existsSync(expectFilepath)) {
            fs.writeFileSync(expectFilepath, content, "utf8")
        }
    },
    listupFiles,
    existsPath(p) {
        try {
            fs.statSync(p)
            return true
        } catch (error) {
            if (error.code === "ENOENT") {
                return false
            }
            throw error
        }
    },
    sortMessages(messages) {
        return messages.slice().sort((a, b) => {
            if (a.line > b.line) {
                return 1
            }
            if (a.line < b.line) {
                return -1
            }
            if (a.column > b.column) {
                return 1
            }
            if (a.column < b.column) {
                return -1
            }
            if (a.endLine == null) {
                return b.endLine != null
                    ? 1
                    : a.ruleId > b.ruleId
                    ? 1
                    : a.ruleId < b.ruleId
                    ? -1
                    : 0
            }
            if (b.endLine == null) {
                return -1
            }
            if (a.endLine > b.endLine) {
                return 1
            }
            if (a.endLine < b.endLine) {
                return -1
            }
            if (a.endColumn > b.endColumn) {
                return 1
            }
            if (a.endColumn < b.endColumn) {
                return -1
            }
            return a.ruleId > b.ruleId ? 1 : a.ruleId < b.ruleId ? -1 : 0
        })
    },
}
