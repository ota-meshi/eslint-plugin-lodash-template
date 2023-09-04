// eslint-disable-next-line eslint-comments/disable-enable-pair -- ignore
/* eslint-disable require-jsdoc -- ignore */
"use strict";

const assert = require("assert");
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const testUtils = require("../test-utils");
const semver = require("semver");
const eslintVersion = require("eslint/package.json").version;

// cp.execSync("npm pack", { stdio: "inherit" })
// const orgTgzName = path.resolve(
//     `eslint-plugin-lodash-template-${
//         require("../../../package.json").version
//     }.tgz`,
// )
// const tgzName = path.resolve("eslint-plugin-lodash-template-test.tgz")
// if (fs.existsSync(tgzName)) {
//     fs.unlinkSync(tgzName)
// }
// fs.renameSync(orgTgzName, tgzName)

// const tgzName = path.dirname(require.resolve("../../../package.json"))

const FIXTURE_DIR = path.join(
    __dirname,
    "../../tests_fixtures/script-processor-repos",
);
const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`;

function* iterateFixtures(rootDir) {
    for (const entry of fs.readdirSync(rootDir, {
        withFileTypes: true,
    })) {
        if (entry.name === "node_modules") {
            continue;
        }
        if (!entry.isDirectory()) {
            continue;
        }
        const fixtureDir = path.join(rootDir, entry.name);
        if (fs.existsSync(path.join(fixtureDir, "package.json"))) {
            yield {
                fixtureDir,
                entryName: fixtureDir
                    .slice(FIXTURE_DIR.length)
                    .replace(/\\/gu, "/"),
            };
        } else {
            yield* iterateFixtures(fixtureDir);
        }
    }
}

function* iterateAllFiles(rootDir) {
    for (const entry of fs.readdirSync(rootDir, {
        withFileTypes: true,
    })) {
        if (entry.name === "node_modules") {
            continue;
        }
        const target = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            yield* iterateAllFiles(target);
            continue;
        }
        yield target;
    }
}

function makeDirs(dir) {
    if (!fs.existsSync(dir)) {
        makeDirs(path.dirname(dir));
        fs.mkdirSync(dir);
    }
}

function setup(dir, outDir) {
    const IN = path.join(dir, "input");

    for (const inFile of iterateAllFiles(IN)) {
        const outFiles = [path.join(outDir, path.relative(IN, inFile))];
        for (const out of outFiles) {
            if (fs.existsSync(out)) {
                fs.unlinkSync(out);
            }
            makeDirs(path.dirname(out));
            fs.copyFileSync(inFile, out);
        }
    }
}

describe("script test", () => {
    if (!semver.satisfies(eslintVersion, ">=8")) {
        return;
    }
    for (const { fixtureDir, entryName } of iterateFixtures(FIXTURE_DIR)) {
        const OUT = path.join(fixtureDir, "output");
        const OUT_WITH_FIX = path.join(fixtureDir, "output-with-fix");

        describe(`Integration for ${entryName}`, () => {
            let originalCwd;

            before(() => {
                originalCwd = process.cwd();
                process.chdir(fixtureDir);
                // cp.execSync(`npm i -D ${tgzName}`, { stdio: "inherit" })
                // cp.execSync(
                //     "npx rimraf ./node_modules/eslint-plugin-lodash-template",
                //     { stdio: "inherit" },
                // )
                cp.execSync("npm i --legacy-peer-deps", { cwd: fixtureDir });
            });
            after(() => {
                process.chdir(originalCwd);
            });

            it("lint", () => {
                const RESULT_PATH = path.join(OUT, "result.json");
                setup(fixtureDir, OUT);
                return new Promise((resolve, reject) => {
                    cp.exec(
                        `${ESLINT} output -f json`,
                        { cwd: fixtureDir, maxBuffer: Infinity },
                        (error, stdout, stderr) => {
                            let results;
                            try {
                                results = stdoutToResult(stdout, fixtureDir);
                            } catch (e) {
                                if (stderr) {
                                    processError(stderr);
                                    reject(error);
                                    return;
                                }
                                reject(e);
                            }
                            if (
                                fs.existsSync(RESULT_PATH) &&
                                !testUtils.isUpdateMode()
                            ) {
                                const expected = require(RESULT_PATH);
                                assert.deepStrictEqual(results, expected);
                            } else {
                                fs.writeFileSync(
                                    RESULT_PATH,
                                    JSON.stringify(results, null, 2),
                                );
                            }
                            resolve();
                        },
                    );
                });
            });
            it("lint with fix", () => {
                const RESULT_PATH = path.join(OUT_WITH_FIX, "result.json");
                setup(fixtureDir, OUT_WITH_FIX);
                return new Promise((resolve, reject) => {
                    cp.exec(
                        `${ESLINT} output-with-fix --fix -f json`,
                        { cwd: fixtureDir, maxBuffer: Infinity },
                        (error, stdout, stderr) => {
                            let results;
                            try {
                                results = stdoutToResult(stdout, fixtureDir);
                            } catch (e) {
                                if (stderr) {
                                    processError(stderr);
                                    reject(error);
                                    return;
                                }
                                reject(e);
                            }
                            if (
                                fs.existsSync(RESULT_PATH) &&
                                !testUtils.isUpdateMode()
                            ) {
                                const expected = require(RESULT_PATH);
                                assert.deepStrictEqual(results, expected);
                            } else {
                                fs.writeFileSync(
                                    RESULT_PATH,
                                    JSON.stringify(results, null, 2),
                                );
                            }
                            resolve();
                        },
                    );
                });
            });
        });
    }
});

function processError(stderr) {
    console.error(stderr);
    const matchConfig =
        /ESLint couldn't find the config "(@?[-a-z]+|@[-a-z]+\/[-a-z]+)" to extend from./u.exec(
            stderr,
        );
    if (matchConfig) {
        const config = matchConfig[1];
        if (config.startsWith("@")) {
            if (config.includes("/")) {
                if (config.includes("/eslint-config")) {
                    cp.execSync(`npm i -D ${config}`, {
                        stdio: "inherit",
                    });
                } else {
                    cp.execSync(
                        `npm i -D ${config.replace("/", "/eslint-config-")}`,
                        {
                            stdio: "inherit",
                        },
                    );
                }
            } else {
                cp.execSync(`npm i -D ${config}/eslint-config`, {
                    stdio: "inherit",
                });
            }
        } else {
            cp.execSync(`npm i -D eslint-config-${config}`, {
                stdio: "inherit",
            });
        }
    }

    if (/Environment key "jest\/globals" is unknown/u.test(stderr)) {
        cp.execSync(`npm i -D eslint-plugin-jest`, {
            stdio: "inherit",
        });
    }

    const matchCmd = /npm install @?[-/a-z]+@latest --save-dev/u.exec(stderr);
    if (matchCmd) {
        const cmd = matchCmd[0];
        cp.execSync(`${cmd}`, {
            stdio: "inherit",
        });
    }
}

function stdoutToResult(stdout, fixtureDir) {
    return JSON.parse(stdout).map((result) => {
        return {
            filePath: result.filePath.slice(fixtureDir.length),
            messages: testUtils.sortMessages(
                normalizeMessages(result.messages),
            ),
        };
    });
}

function normalizeMessages(messages) {
    return JSON.parse(
        JSON.stringify(
            messages,
            (key, value) => {
                if (
                    [
                        "severity",
                        "nodeType",
                        "messageId",
                        "fix",
                        "suggestions",
                    ].includes(key)
                ) {
                    return undefined;
                }
                return value;
            },
            2,
        ),
    );
}
