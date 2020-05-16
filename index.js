#!/usr/bin/env node

const fs = require("fs");
const findPairedBracketInJSON = require("./findPairedBracketInJSON")
const pagesToFirebaseHostingRewriteJson = require("./pagesToFirebaseHostingRewriteJson")

const indentationCount = 2;

function main() {
    const firebaseJson = fs.readFileSync("firebase.json", "utf8");

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

    const rewrites = pagesToFirebaseHostingRewriteJson("pages");
    const rewritesJsonStr = JSON.stringify(rewrites, null, " ".repeat(indentationCount))
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
    fs.writeFileSync("firebase.json", rewritedFirebaseJson);
}

main()
