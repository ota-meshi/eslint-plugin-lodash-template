"use strict"

const serviceContainer = new Map()
const parseTargetContainer = new Map()
const htmlTargetContainer = new Map()

/**
 * If the specified filename is not already associated with a value, attempts to compute its value using the given supplier function and enters it into this map.
 * @param {Map} container container map
 * @param {string} filename filename
 * @param {function} supplier supplier function
 */
function computeIfAbsent(container, filename, supplier) {
    let data = container.get(filename)
    if (data == null && supplier) {
        data = supplier(filename)
        container.set(filename, data)
    }
    return data
}

/**
 * Unregister the specified filename value
 * @param {Map} container container map
 * @param {string} filename filename
 * @param {function} supplier supplier function
 */
function unregister(container, filename, mapping) {
    let data = container.get(filename)
    if (data != null) {
        data = mapping(data)
        if (data == null) {
            container.delete(filename)
        }
    }
}

module.exports = {
    addParseTargetFile(filename) {
        const num = computeIfAbsent(parseTargetContainer, filename, () => 0)
        parseTargetContainer.set(filename, num + 1)
    },
    isParseTargetFile(filename) {
        const num = parseTargetContainer.get(filename)
        return num != null && num > 0
    },
    addHtmlFile(fileName) {
        const num = computeIfAbsent(htmlTargetContainer, fileName, () => 0)
        htmlTargetContainer.set(fileName, num + 1)
    },
    isHtmlFile(fileName) {
        const num = htmlTargetContainer.get(fileName)
        return num != null && num > 0
    },
    addService(fileName, service) {
        const arr = computeIfAbsent(serviceContainer, fileName, () => [])
        arr.push(service)
    },
    getService(filename) {
        const arr = serviceContainer.get(filename)
        if (!arr) {
            return null
        }
        return arr[arr.length - 1] || null
    },
    unregisters(filename) {
        unregister(serviceContainer, filename, arr => {
            arr.pop()
            return arr.length ? arr : null
        })

        unregister(parseTargetContainer, filename, num =>
            num <= 1 ? null : num - 1
        )
        unregister(htmlTargetContainer, filename, num =>
            num <= 1 ? null : num - 1
        )
    },
}
