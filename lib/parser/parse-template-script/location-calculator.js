// @ts-check
"use strict";

/**
 * @typedef {import('../../services/micro-template-service')} MicroTemplateService
 */

class LocationMap {
    constructor() {
        this.mappers = [];
        this.orgIndex = 0;
        this.newIndex = 0;
        this.batchLengthOrg = 0;
        this.batchLengthNew = 0;
    }

    applyEq(length) {
        if (length <= 0) {
            return;
        }
        this.flush();
        const newEnd = this.newIndex + length;
        const orgEnd = this.orgIndex + length;
        this.addMap([this.orgIndex, orgEnd], [this.newIndex, newEnd]);
        this.newIndex = newEnd;
        this.orgIndex = orgEnd;
    }

    applyIns(length) {
        this.batchLengthNew += length;
    }

    applyDel(length) {
        this.batchLengthOrg += length;
    }

    flush() {
        if (this.batchLengthNew || this.batchLengthOrg) {
            const newEnd = this.newIndex + this.batchLengthNew;
            const orgEnd = this.orgIndex + this.batchLengthOrg;
            this.addMap([this.orgIndex, orgEnd], [this.newIndex, newEnd]);
            this.newIndex = newEnd;
            this.orgIndex = orgEnd;
            this.batchLengthOrg = 0;
            this.batchLengthNew = 0;
        }
    }

    addMap(orgRange, newRange) {
        if (orgRange[0] === newRange[0] && orgRange[1] === newRange[1]) {
            return;
        }
        this.mappers.unshift({
            org: orgRange,
            new: newRange,
        });
    }

    remapIndex(index) {
        for (const mapper of this.mappers) {
            if (mapper.new[0] <= index && index < mapper.new[1]) {
                const offset = index - mapper.new[0];
                return Math.min(mapper.org[0] + offset, mapper.org[1] - 1);
            }
            if (index === mapper.new[1]) {
                return mapper.org[1];
            }
        }
        return index;
    }
}

/**
 * Location calculators.
 */
class LocationCalculator {
    /**
     * Initialize this calculator.
     * @param {LocationMap} locationMap The location mapper.
     * @param {MicroTemplateService} microTemplateService microTemplateService
     */
    constructor(locationMap, microTemplateService) {
        this.locationMap = locationMap;
        this.microTemplateService = microTemplateService;
    }

    /**
     * Modify the location information of the given node with using the base offset and gaps of this calculator.
     * @param {ASTNode} node The node to modify their location.
     */
    fixLocation(node) {
        const range = node.range;
        const loc = node.loc;
        const start = this.locationMap.remapIndex(range[0]);
        const end = this.locationMap.remapIndex(range[1]);

        range[0] = start;
        if (node.start != null) {
            node.start = start;
        }
        loc.start = this.microTemplateService.getLocFromIndex(start);

        range[1] = end;
        if (node.end != null) {
            node.end = end;
        }
        loc.end = this.microTemplateService.getLocFromIndex(end);

        return node;
    }

    /**
     * Modify the location information of the given error with using the base offset and gaps of this calculator.
     * @param error The error to modify their location.
     */
    fixErrorLocation(error) {
        error.index = this.locationMap.remapIndex(error.index);

        const loc = this.microTemplateService.getLocFromIndex(error.index);
        error.lineNumber = loc.line;
        error.column = loc.column + 1;
    }
}

module.exports = {
    LocationMap,
    LocationCalculator,
};
