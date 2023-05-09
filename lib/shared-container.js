// @ts-check
"use strict";

/**
 * @typedef {import('./services/micro-template-service')} MicroTemplateService
 */

/**
 * @type {Map<string, Container>}
 */
const containers = new Map();

class Container {
    constructor(filename) {
        this.filename = filename;
        this.flags = new Set();
        /**
         * @type {Map<string, PathCoveredTemplate>}
         */
        this.pathCoveredTemplates = new Map();
    }

    parseTarget() {
        this.flags.add("parseTarget");
    }

    isParseTarget() {
        return this.flags.has("parseTarget");
    }

    html() {
        this.flags.add("html");
    }

    isHtml() {
        return this.flags.has("html");
    }

    setService(service) {
        this.service = service;
    }

    /**
     * @returns {MicroTemplateService}
     */
    getService() {
        return this.service;
    }

    addPathCoveredTemplate(scriptFilename, pathCoveredTemplate) {
        this.pathCoveredTemplates.set(scriptFilename, pathCoveredTemplate);
    }

    /**
     * @param {string} filename filename
     */
    getPathCoveredTemplate(filename) {
        for (const scriptFilename of this.pathCoveredTemplates.keys()) {
            if (filename.endsWith(scriptFilename)) {
                return this.pathCoveredTemplates.get(scriptFilename);
            }
        }
        return null;
    }
}

module.exports = {
    /**
     * @param {string} filename filename
     * @returns {Container} Container
     */
    register(filename) {
        let container = containers.get(filename);
        if (!container) {
            container = new Container(filename);
            containers.set(filename, container);
        }
        return container;
    },
    /**
     * @param {string} filename filename
     * @returns {Container|null} Container
     */
    get(filename) {
        return containers.get(filename) || null;
    },
    unregister(filename) {
        containers.delete(filename);
    },
    /**
     * @param {string} filename filename
     * @returns {PathCoveredTemplate} PathCoveredTemplate
     */
    getPathCoveredTemplate(filename) {
        for (const container of containers.values()) {
            if (filename.startsWith(container.filename)) {
                const template = container.getPathCoveredTemplate(filename);
                if (template) {
                    return template;
                }
            }
        }
        return false;
    },
};
