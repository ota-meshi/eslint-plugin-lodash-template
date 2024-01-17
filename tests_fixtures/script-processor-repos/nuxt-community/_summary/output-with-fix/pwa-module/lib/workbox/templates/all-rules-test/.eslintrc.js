

module.exports = {
    "root": true,
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:all",
        "plugin:lodash-template/all",
        "plugin:@stylistic/all-extends"
    ],
    "overrides": [
        {
            "files": "*.js",
            "processor": "lodash-template/script",
            "parserOptions": {
                "ecmaVersion": 2022,
                "sourceType": "module"
            },
            "globals": {
                "options": true,
                "serialize": true,
                "process": true,
                "require": true
            },
            "rules": {
                "one-var": "off",
                "lodash-template/prefer-escape-template-interpolations": "off"
            }
        }
    ]
};
