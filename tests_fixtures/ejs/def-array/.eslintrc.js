/* globals module */
module.exports = {
    "env": {},
    "extends": [
        "eslint:all",
        "plugin:lodash-template/all"
    ],
    "overrides": [
        {
            "files": ["*.ejs"],
            "globals": {
                "include": true
            },
            "processor": "lodash-template/html"
        }
    ],
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "root": true
};
