const glob = require('glob');

function getNextPagesFiles(pageDir) {
    // node-glob requests forward-slashes
    const pages = glob.sync(`${pageDir}/**/*.+(js|jsx|ts|tsx)`);
    const htmls = pages
        .map(page => page.substr(pageDir.length+1))
        .filter(page => !(page.startsWith("_app") || page.startsWith("_document")))
        .filter(page => !page.startsWith("api/"))
    return htmls;
}

module.exports = getNextPagesFiles;
