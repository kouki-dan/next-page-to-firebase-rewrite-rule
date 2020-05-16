
const pagesToFirebaseHostingRewriteJson = require('./pagesToFirebaseHostingRewriteJson');

test('pages should load correctly', () => {
    const json = pagesToFirebaseHostingRewriteJson('pages-sample');
    expect(json).toEqual([
        {
            "source": "index",
            "destination": "index.html"
        },
        {
            "source": "dir1/dir1",
            "destination": "dir1/dir1.html"
        },
        {
            "source": "pages-sample/same-directory-name",
            "destination": "pages-sample/same-directory-name.html"
        },
        {
            "source": "dir1/api/it-is-no-api",
            "destination": "dir1/api/it-is-no-api.html"
        },
        {
            "source": "dir1/dir2/dir2",
            "destination": "dir1/dir2/dir2.html"
        },
        {
            "source": "dir1/*",
            "destination": "dir1/[id].html"
        },
        {
            "source": "*/*",
            "destination": "[var]/[id].html"
        },
    ]);
});
