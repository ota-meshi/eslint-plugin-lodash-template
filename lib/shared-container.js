"use strict"

const container = new Map()

module.exports = {
    addService(fileName, service) {
        let arr = container.get(fileName)
        if (!arr) {
            arr = []
            container.set(fileName, arr)
        }
        arr.push(service)
    },
    popService(fileName) {
        const arr = container.get(fileName)
        if (!arr) {
            return null
        }
        const res = arr.pop()
        if (!arr.length) {
            container.delete(fileName)
        }
        return res
    },
}
