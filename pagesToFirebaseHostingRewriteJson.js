const getNextPagesFiles = require('./getNextPagesFiles');

const anyRegExp = /\[[^/]+\]/g;

const extensionRegExp = /\.(js|jsx|ts|tsx)$/
function removeExtension(path) {
    return path.replace(extensionRegExp, "");
}

function convertAnyToAsterisk(path) {
    return path.replace(anyRegExp, "*")
}

function pagesToFirebaseHostingRewriteJson(pageDir) {
    const files = getNextPagesFiles(pageDir);
    const rewrites = [];
    const anyRewrites = [];
    files.forEach(file => {
        const splitted = file.split("/");
        const depth = splitted.length;

        if (anyRegExp.test(file)) {
            const anyCount = convertAnyToAsterisk(file).split("*").length-1;
            if (!anyRewrites[depth]) {
                anyRewrites[depth] = []
            }
            if (!anyRewrites[depth][anyCount]) {
                anyRewrites[depth][anyCount] = [];
            }
            anyRewrites[depth][anyCount].push(file);
        } else {
            if (rewrites[depth]) {
                rewrites[depth].push(file);
            } else {
                rewrites[depth] = [file];
            }
        }
    });

    const sortedRewrites = rewrites.flat().concat(anyRewrites.flat(2));

    return sortedRewrites.map(x => {
        return {
            "source": convertAnyToAsterisk(removeExtension(x)),
            "destination": removeExtension(x)+".html"
        }
    })
}

module.exports = pagesToFirebaseHostingRewriteJson;
