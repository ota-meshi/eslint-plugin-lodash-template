const md5 = require("js-md5");

module.exports = {
    createHash() {
        const hash = md5.create();
        return {
            update(encoding) {
                hash.update(encoding);
                return {
                    digest() {
                        return hash.hex();
                    },
                };
            },
        };
    },
};
