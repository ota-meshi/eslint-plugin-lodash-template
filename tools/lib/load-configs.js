"use strict";

const path = require("path");
const fs = require("fs");

/**
 * Get the all configs
 * @returns {Array} The all configs
 */
function readConfigs() {
    const configsRoot = path.resolve(__dirname, "../../lib/configs");
    const result = fs.readdirSync(configsRoot);
    const configs = [];
    for (const name of result) {
        const configName = name.replace(/\.js$/u, "");
        const configId = `plugin:lodash-template/${configName}`;
        const configPath = require.resolve(path.join(configsRoot, name));

        const config = require(configPath);
        configs.push({
            name: configName,
            configId,
            config,
            path: configPath,
        });
    }
    return configs;
}

const configs = readConfigs();

for (const config of configs) {
    const extendsList = !config.config.extends
        ? []
        : Array.isArray(config.config.extends)
        ? config.config.extends
        : [config.config.extends];
    config.extends = extendsList.map((p) => configs.find((c) => c.path === p));
}

module.exports = configs;
