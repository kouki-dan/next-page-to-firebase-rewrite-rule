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
    let rewritesJsonStr = JSON.stringify(rewrites, null, indentation + " ".repeat(indentationCount));
    rewritesJsonStr = rewritesJsonStr.substr(0, rewritesJsonStr.length-1) + indentation + "]";

    const rewritedFirebaseJson = firebaseJson.substr(0, open) +
        rewritesJsonStr +
        firebaseJson.substr(end+1)
    fs.writeFileSync("firebase.json", rewritedFirebaseJson);
}

main()
