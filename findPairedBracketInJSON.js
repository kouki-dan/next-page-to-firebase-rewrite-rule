var assert = require('assert');

const pairedBracket = {
    "[": "]",
    "{": "}",
    "(": ")",
}

function findPairedBracketInJSON(target, bracket, after) {
    assert(pairedBracket[bracket])
    after = after || 0;

    let bracketCount = 0;
    let inString = false;
    let openBracketFound = false;
    let openBracketIndex;
    for (let i = after; i < target.length; i++) {
        // Skip Strings
        if (inString) {
            if (target[i] === "\"" && target[i-1] !== "\\") {
                inString = false;
            }
            continue;
        } else {
            if (target[i] === "\"") {
                inString = true;
                continue;
            }
        }

        // Skip until finding first open bracket
        if (!openBracketFound) {
            if (target[i] === bracket) {
                openBracketFound = true;
                openBracketIndex = i;
            }
            continue;
        }

        if (target[i] === bracket) {
            bracketCount += 1;
        }

        // If find
        if (target[i] === pairedBracket[bracket]) {
            if (bracketCount === 0) {
                return [openBracketIndex, i];
            } else {
                bracketCount -= 1;
            }
        }
    }
}

module.exports = findPairedBracketInJSON;