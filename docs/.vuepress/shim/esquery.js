const esquery = require("../../../node_modules/esquery")

if (esquery.default) {
    module.exports = esquery.default
} else {
    module.exports = esquery
}
