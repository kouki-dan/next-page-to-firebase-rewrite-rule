
const getNextPagesFiles = require('./getNextPagesFiles');

test('pages should load correctly', () => {
    const files = getNextPagesFiles('pages-sample');
    expect(files).toEqual(
      expect.arrayContaining([
        "[var]/[id].js",
        "dir1/[id].ts",
        "dir1/api/it-is-no-api.js",
        "dir1/dir1.jsx",
        "dir1/dir2/dir2.tsx",
        "index.ts",
        "pages-sample/same-directory-name.js",
      ])
    );
});
