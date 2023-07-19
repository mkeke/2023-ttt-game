const conf = {

  outfilename: "minmax.js",

  // player characters. pMax is always the starting player
  pMax: "X", pMin: "O", empty: ".",

  // node status
  status: { win: "w", loss: "l", draw: "d", on: "o" },

  // score
  score: { w: 100, l: -100, d: 0 },

  /*
    3 in a row
    --------------
    1 972 818 nodes with no end check (calculated)
        5 478 nodes with end check and no duplicates
  */
  w: 3, h: 3,
  wins: [
    "XXX......", "...XXX...", "......XXX", 
    "X..X..X..", ".X..X..X.", "..X..X..X",
    "X...X...X", "..X.X.X.."
  ],
  losses: [
    "OOO......", "...OOO...", "......OOO", 
    "O..O..O..", ".O..O..O.", "..O..O..O",
    "O...O...O", "..O.O.O.."
  ],
  maxLevel: 100,

  /*
    2 in a row
    128 nodes with no end check, 
     66 nodes with end check and no duplicates
  */
  /*
  w: 2, h: 2,
  // only allow horizontal wins / losses
  wins: ["XX..", "..XX"],
  losses: ["OO..", "..OO"],
  maxLevel: 100,
  */

  /*
  */

  /*
    DANGER ZONE!
    4 in a row
    1 706 221 186 596 512 nodes with no end check (calculated)
  */
  /*
  w: 4, h: 4,
  maxLevel: 8,
  wins: [
    "XXXX............", "....XXXX........", "........XXXX....", "............XXXX",
    "X...X...X...X...", ".X...X...X...X..", "..X...X...X...X.", "...X...X...X...X", 
    "X....X....X....X", "...X..X..X..X..."
  ],
  losses: [
    "OOOO............", "....OOOO........", "........OOOO....", "............OOOO",
    "O...O...O...O...", ".O...O...O...O..", "..O...O...O...O.", "...O...O...O...O", 
    "O....O....O....O", "...O..O..O..O..."
  ],
  */
};

module.exports = { conf };