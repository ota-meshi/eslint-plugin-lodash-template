/* eslint n/no-unsupported-features/es-syntax: off -- not node */
import pako from "pako";

/**
 * Deserialize a given serialized string then update this object.
 * @param {string} serializedString A serialized string.
 * @returns {object} The deserialized state.
 */
export function deserializeState(serializedString) {
    const state = {
        code: undefined,
        rules: undefined,
        script: false,
        ejs: false,
    };

    if (serializedString === "") {
        return state;
    }

    try {
        const compressedString = window.atob(serializedString);
        const uint8Arr = pako.inflate(
            Uint8Array.from(compressedString, (c) => c.charCodeAt(0)),
        );

        const jsonText = new TextDecoder().decode(uint8Arr);
        const json = JSON.parse(jsonText);

        if (typeof json === "object" && json != null) {
            if (typeof json.code === "string") {
                state.code = json.code;
            }
            if (typeof json.rules === "object" && json.rules != null) {
                state.rules = {};
                for (const id of Object.keys(json.rules)) {
                    state.rules[id] = json.rules[id] === 2 ? "error" : "off";
                }
            }
            if (typeof json.script === "boolean") {
                state.script = json.script;
            }
            if (typeof json.ejs === "boolean") {
                state.ejs = json.ejs;
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console -- demo
        console.error(error);
    }

    return state;
}
