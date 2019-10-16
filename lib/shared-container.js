"use strict"

/**
 * @type {Map<string, Container>}
 */
const containers = new Map()

class Container {
    constructor(filename) {
        this.filename = filename
        this.flags = new Set()
        /**
         * @type {Map<string, BranchedTemplate>}
         */
        this.branchedTemplates = new Map()
    }

    parseTarget() {
        this.flags.add("parseTarget")
    }

    isParseTarget() {
        return this.flags.has("parseTarget")
    }

    html() {
        this.flags.add("html")
    }

    isHtml() {
        return this.flags.has("html")
    }

    setService(service) {
        this.service = service
    }

    getService() {
        return this.service
    }

    addBranchedTemplate(scriptFilename, branchedTemplate) {
        this.branchedTemplates.set(scriptFilename, branchedTemplate)
    }

    /**
     * @param {string} filename filename
     */
    getBranchedTemplate(filename) {
        for (const scriptFilename of this.branchedTemplates.keys()) {
            if (filename.endsWith(scriptFilename)) {
                return this.branchedTemplates.get(scriptFilename)
            }
        }
        return null
    }
}

module.exports = {
    /**
     * @param {string} filename filename
     * @returns {Container} Container
     */
    register(filename) {
        let container = containers.get(filename)
        if (!container) {
            container = new Container(filename)
            containers.set(filename, container)
        }
        return container
    },
    /**
     * @param {string} filename filename
     * @returns {Container|null} Container
     */
    get(filename) {
        return containers.get(filename) || null
    },
    unregister(filename) {
        containers.delete(filename)
    },
    /**
     * @param {string} filename filename
     * @returns {BranchedTemplate} BranchedTemplate
     */
    getBranchedTemplate(filename) {
        for (const container of containers.values()) {
            if (filename.startsWith(container.filename)) {
                const template = container.getBranchedTemplate(filename)
                if (template) {
                    return template
                }
            }
        }
        return false
    },
}
