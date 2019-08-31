"use strict"

const fs = require("fs")

module.exports = {
    writeFile(expectFilepath, content) {
        // eslint-disable-next-line no-process-env
        if (process.env.UPDATE_FIXTURE) {
            fs.writeFileSync(expectFilepath, content, "utf8")
        }
    },
}
