const findPairedBracketInJSON = require("./findPairedBracketInJSON");

describe("findPairedBracketInJSON works correctly", () => {
  test("it works", () => {
    expect(
      findPairedBracketInJSON(
        `
{
    "test": [1,2,3]
}
`,
        "["
      )
    ).toEqual([
        1 + 2 + 13 - 1,
        1 + 2 + 19 - 1,
    ]);
  });

  test("in case of nesting", () => {
    expect(
      findPairedBracketInJSON(
        `
{
    "test": [1,[2],[3,[]]]
}
`,
        "["
      )
    ).toEqual([
        1 + 2 + 13 -1,
        1 + 2 + 26 -1,
    ]);
  });

  test("has String", () => {
    expect(
      findPairedBracketInJSON(
        `
{
    "test": [1,[2],[3,["[][]", [], "aaa\\"]"]]]
}
  `,
        "["
      )
    ).toEqual([
        1 + 2 + ( 13 ) -1,
        1 + 2 + (47-1) -1,
    ]);
  });

  test("in case of end bracket in other line", () => {
    expect(
      findPairedBracketInJSON(
        `
{
    "test": [
        1,[2],[3,["[][]", [], "aaa]"]]
    ]
}
`,
        "["
      )
    ).toEqual([
        1 + 2 + 13 -1,
        1 + 2 + 14 + 39 + 5 -1,
    ]);
  })

  test("in case of use after", () => {
    expect(
      findPairedBracketInJSON(
            `
{
    "test": [
        1,[2],[3,["[][]", [], "aaa]"]]
    ]
}
    `,
        "[",
        1 + 2 + 14 + 9
      )
    ).toEqual([
        1 + 2 + 14 + 11 -1,
        1 + 2 + 14 + 13 -1,
    ]);
  });
});
