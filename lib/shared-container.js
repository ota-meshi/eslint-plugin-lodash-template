"use strict"

const serviceContainer = new Map()
const targetContainer = new Map()

/**
 * If the specified fileName is not already associated with a value, attempts to compute its value using the given supplier function and enters it into this map.
 * @param {string} fileName fileName
 * @param {function} supplier supplier function
 */
function computeIfAbsent(container, fileName, supplier) {
    let data = container.get(fileName)
    if (!data && supplier) {
        data = supplier(fileName)
        container.set(fileName, data)
    }
    return data
}

module.exports = {
    pushTargetFile(fileName) {
        const num = computeIfAbsent(targetContainer, fileName, () => 0)
        targetContainer.set(fileName, num + 1)
    },
    hasTargetFile(fileName) {
        const num = targetContainer.get(fileName)
        return num != null && num > 0
    },
    popTargetFile(fileName) {
        const num = computeIfAbsent(targetContainer, fileName, () => 0)
        const result = num > 0
        if (result) {
            targetContainer.set(fileName, num - 1)
        }
        return result
    },
    pushService(fileName, service) {
        const arr = computeIfAbsent(serviceContainer, fileName, () => [])
        arr.push(service)
    },
    popService(fileName) {
        const arr = serviceContainer.get(fileName)
        if (!arr) {
            return null
        }
        const res = arr.pop()
        if (!arr.length) {
            serviceContainer.delete(fileName)
        }
        return res
    },
}
