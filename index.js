#!/usr/bin/env node

const fs = require("fs");
const findPairedBracketInJSON = require("./findPairedBracketInJSON")
const pagesToFirebaseHostingRewriteJson = require("./pagesToFirebaseHostingRewriteJson")
const commandLineArgs = require('command-line-args');
const watch = require('watch')

const optionDefinitions = [
  {
    name: "pagesPath",
    type: String,
    defaultValue: "pages",
  },
  {
    name: "firebaseJsonPath",
    type: String,
    defaultValue: "firebase.json",
  },
  {
    name: "watch",
    type: Boolean,
  },
  {
    name: "indentationCount",
    type: Number,
    defaultValue: 2
  }
];
const options = commandLineArgs(optionDefinitions);

function main() {
    const firebaseJson = fs.readFileSync(options.firebaseJsonPath, "utf8");

    const targetKey = "\"rewrites\"";
    const rewritesStartIndex = firebaseJson.search(targetKey);
    const [open, end] = findPairedBracketInJSON(
        firebaseJson,
        "[",
        rewritesStartIndex+targetKey.length+1
    );

    let indentation = "";
    for (let i = open; i >= 0; i--) {
        const char = firebaseJson[i];
        if (char === "\n") {
            break;
        }
        if (char === " " || char === "\t") {
            indentation += char;
        } else {
            indentation = "";
        }
    }

    const rewrites = pagesToFirebaseHostingRewriteJson(options.pagesPath);
    const rewritesJsonStr = JSON.stringify(rewrites, null, " ".repeat(options.indentationCount))
        .split("\n")
        .map(x => {
            // Special case for first line.
            if (x === "[") {
                return "[";
            }
            return indentation + x;
        })
        .join("\n");
    const rewritedFirebaseJson = firebaseJson.substr(0, open) +
        rewritesJsonStr +
        firebaseJson.substr(end+1)
    fs.writeFileSync(options.firebaseJsonPath, rewritedFirebaseJson);
}

main();

if (options.watch) {
    watch.createMonitor(options.pagesPath, function (monitor) {
        monitor.on("created", function (f, stat) {
            main()
        })
        monitor.on("removed", function (f, stat) {
            main()
        })
    })
}