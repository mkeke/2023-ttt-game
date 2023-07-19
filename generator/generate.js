// tic tac toe minmax tree generator

const fs = require("fs");
const { conf } = require("./conf.js");
const log = console.log;
const startTime = new Date().getTime();
const nodes = {};

// add empty board, assuming pMax is the starting player
nodes[`${conf.empty.repeat(conf.w*conf.h)}`] = {};

// generate levelMultiplier (see function calculateScore)
const levelMultiplier = [];
for(let i=0; i<=conf.w*conf.h; i++) { // 0 -> 9 for 3x3 boards
  levelMultiplier.unshift(Math.pow(10,i));
}

log("adding nodes..");
addNodes();
const midTime = new Date().getTime();
log(`  added ${Object.keys(nodes).length} nodes in ${(midTime-startTime)/1000} seconds.`);

log("calculating scores..");
calculateScore();
const endTime = new Date().getTime();
log(`  scores calculated in ${(endTime - midTime)/1000} seconds.`);

log(`process completed in ${(endTime-startTime)/1000} seconds.`);

humanIntervention();

saveFile();

function humanIntervention() {
  // overriding moves that are not optimal (see readme)

  // X..   X..   XO.   X..
  // .OO   .O.   .O.   OO.  + mirrored X
  // ..X   .OX   ..X   ..X
  nodes["X...OO..X"] = {status:"o", score:-400000};
  nodes["X...O..OX"] = {status:"o", score:-400000};
  nodes["XO..O...X"] = {status:"o", score:-400000};
  nodes["X..OO...X"] = {status:"o", score:-400000};
  nodes["..X.OOX.."] = {status:"o", score:-400000};
  nodes["..X.O.XO."] = {status:"o", score:-400000};
  nodes[".OX.O.X.."] = {status:"o", score:-400000};
  nodes["..XOO.X.."] = {status:"o", score:-400000};

  // X.X   X.X   O..   ..O   X.O   X..   O.X   ..X
  // ...   ...   ...   ...   ...   ...   ...   ...
  // O..   ..O   X.X   X.X   X..   X.O   ..X   O.X
  nodes["X.X...O.."] = {status:"o", score:6000000};
  nodes["X.X.....O"] = {status:"o", score:6000000};
  nodes["O.....X.X"] = {status:"o", score:6000000};
  nodes["..O...X.X"] = {status:"o", score:6000000};
  nodes["X.O...X.."] = {status:"o", score:6000000};
  nodes["X.....X.O"] = {status:"o", score:6000000};
  nodes["O.X.....X"] = {status:"o", score:6000000};
  nodes["..X...O.X"] = {status:"o", score:6000000};

}

function saveFile(){
  log(`saving file: ${conf.outfilename}..`);
  let str = "const minmax = {\n";
  for(const key in nodes) {
    str += `"${key}":{s:"${nodes[key].status}",v:${nodes[key].score}}, `;
  }
  str += "\n};export default minmax;";
  fs.writeFileSync(conf.outfilename, str, "utf8");
}

function calculateScore() {
  // set score on all finished nodes

  /*
    win/loss score is relative to the depth.
    To choose the quickest (safest) way to win, wins/losses on shallow
    levels must have larger scores than those on deeper levels.
    Also, the scores from shallow-leveled wins must not be overtaken by
    accumulated values from the deep.
    With a max depth of 10 (0 - 9 occupied tiles) it seems fair to
    divide the score by 10 for each new level.
    This is done by use of a levelMultiplier lookup table
  */

  for(let key in nodes) {
    if(nodes[key].status !== conf.status.on) {

      if(nodes[key].status !== conf.status.draw) {
        let level = key.split("").filter(s=>s!==conf.empty).length;
        nodes[key].score = conf.score[nodes[key].status] * levelMultiplier[level];
      } else {
        nodes[key].score = conf.score[nodes[key].status];
      }
    }
  }

/*
                                                                           80->|
The following illustrates a branch of possible moves from a given board.
All moves that result in either win, loss or draw stops further branching.
Finished nodes are marked MAX (x won), MIN (o lost) or DRW (it's a draw).
Players X and O take turns for each level.

X:                                                                       
   OXX                                                                   
   .X.                                                                   
   O..                                                                   
   |________________________________________________________________     
   |                   |                             |              |    
O: |                   |                             |              MIN  
   OXX                 OXX                           OXX            OXX  
   .XO                 .X.                           .X.            OX.  
   O..                 OO.                           O.O            O..  
   |______________     |___________________          |______________     
   |         |    |    |         |         |         |         |    |    
X: |         |    MAX  |         |         |         |         |    MAX  
   OXX       OXX  OXX  OXX       OXX       OXX       OXX       OXX  OXX  
   XXO       .XO  .XO  XX.       .XX       .X.       XX.       .XX  .X.  
   O..       O.X  OX.  OO.       OO.       OOX       O.O       O.O  OXO  
   |____     |____     |____     |____     |____     |____     |____     
   |    |    |    |    |    |    |    |    |    |    |    |    |    |    
O: |    |    MIN  |    |    MIN  MIN  MIN  MIN  |    |    MIN  MIN  MIN  
   OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  OXX  
   XXO  XXO  OXO  .XO  XXO  XX.  OXX  .XX  OX.  .XO  XXO  XX.  OXX  .XX  
   OO.  O.O  O.X  OOX  OO.  OOO  OO.  OOO  OOX  OOX  O.O  OOO  O.O  OOO  
   |    |         |    |                        |    |                   
   |    |         |    |                        |    |                   
X: DRW  MAX       DRW  DRW                      DRW  MAX                 
   OXX  OXX       OXX  OXX                      OXX  OXX                 
   XXO  XXO       XXO  XXO                      XXO  XXO                 
   OOX  OXO       OOX  OOX                      OOX  OXO                 


Removing the board to see the status identifiers more clearly

X:                                                                       
   OXX                                                                   
   .X.                                                                   
   O..                                                                   
   |________________________________________________________________     
   |                   |                             |              |    
O: |                   |                             |              MIN  
   |______________     |___________________          |______________     
   |         |    |    |         |         |         |         |    |    
X: |         |    MAX  |         |         |         |         |    MAX  
   |____     |____     |____     |____     |____     |____     |____     
   |    |    |    |    |    |    |    |    |    |    |    |    |    |    
O: |    |    MIN  |    |    MIN  MIN  MIN  MIN  |    |    MIN  MIN  MIN  
   |    |         |    |                        |    |                   
   |    |         |    |                        |    |                   
X: DRW  MAX       DRW  DRW                      DRW  MAX                 


All finished nodes are given an initial score
DRW: 0 points, MAX: 100 points, MIN: -100 points

To be able to choose the quickest (safest) way to win, the closest available
wins and losses (further up) must have a substantioal higher score than wins
and losses further down the path.

MAX and MIN need to be multiplied with a level-specific multiplier that
decreases as the level gets deeper and deeper, or rather increases as the
level gets higher and higher.

Level multiplier for the lowest level (level 9) is 1
Level 8: 10
level 7: 100
level 6: 1000
and so on, as defined by the following lookup table

const levelMultiplier = [];
for(let i=0; i<=9; i++) { // 0 -> 9 for 3x3 boards
  levelMultiplier.unshift(Math.pow(10,i));
}

The finished nodes are given a score, 
and unfinised nodes get the sum of its immediate children.

X:                                                                             
   OXX                                                                         
   .X.                                                                         
   O..                                                                         
   |______________________________________________________________________     
   |                    |                                |                |    
O: |                    |                                |             -100000 
   |_______________     |______________________          |________________     
   |         |     |    |          |           |         |          |     |    
X: |         |   10000  |          |           |         |          |   10000  
   |____     |_____     |____      |_____      |____     |____      |_____     
   |    |    |     |    |    |     |     |     |    |    |    |     |     |    
O: |    |  -1000   |    |  -1000 -1000 -1000 -1000  |    |  -1000 -1000 -1000  
   |    |          |    |                           |    |                     
   |    |          |    |                           |    |                     
X: 0    100        0    0                           0    100                   


X:                                                                             
   OXX                                                                         
   .X.                                                                         
   O..                                                                         
   |______________________________________________________________________     
   |                    |                                |                |    
O: 9100               -4000                            7100            -100000 
   OXX                  OXX                              OXX              OXX
   .XO                  .X.                              .X.              OX.
   O..                  OO.                              O.O              O..
   |_______________     |______________________          |________________     
   |         |     |    |          |           |         |          |     |    
X: 100     -1000 10000 -1000     -2000       -1000     -900       -2000 10000  
   |____     |_____     |____      |_____      |____     |____      |_____     
   |    |    |     |    |    |     |     |     |    |    |    |     |     |    
O: |    |  -1000   |    |  -1000 -1000 -1000 -1000  |    |  -1000 -1000 -1000  
   |    |          |    |                           |    |                     
   |    |          |    |                           |    |                     
X: 0    100        0    0                           0    100                   


Player O will now select the move that has the lowest possible score,
and win the game.

*/

  // accumulate the rest
  let finished = true;
  do {
    finished = true;
    for(let key in nodes) {
      if(nodes[key].score === undefined) {
        // examine children
        let children = getChildren(key);
        let sumok = true;
        let sum = 0;
        for(const child of children) {
          if(nodes[child] !== undefined) {
            if(nodes[child].score !== undefined) {
              sum += nodes[child].score;
            } else {
              // child exists but has no calculated score yet
              sumok = false;
              finished = false;
              break;
            }
          } else {
            // max depth reached, no more child nodes
            // TODO determine score based on the board
            nodes[key].score = conf.score.draw;
            break;
          }
        }
        if (sumok) {
          nodes[key].score = sum;
        }
      }
    }
  } while(!finished);
}

function getChildren(key){
  let children = [];

  let currentPlayer = conf.pMax;
  let board = key;

  if((conf.w*conf.h - board.split("").filter(s=>s===conf.empty).length) % 2 === 1) {
    currentPlayer = conf.pMin;
  }

  for(let pos=0; pos<board.length; pos++) {
    if(board[pos] === conf.empty) {
      let childBoard = board.substring(0,pos) + currentPlayer + board.substring(pos+1);
      children.push(childBoard);
    }
  }

  return children;
}

function addNodes() {

  let keys = Object.keys(nodes);
  for(let i=0; i<keys.length; i++) {
    let board = keys[i];

    let status = getBoardStatus(board);
    nodes[keys[i]].status = status;

    let level = board.split("").filter(s=>s!==conf.empty).length;
    if(level < conf.maxLevel && status === conf.status.on) {

      // toggle current player
      let currentPlayer = level%2===0?conf.pMax:conf.pMin;

// TODO if one or more child is solution, then remove the rest of the children. no reason to proceed
// if player is stupid and doesnt finish, what then? we have no nodes to examine. realtime is needed.
// or a score system that does not take into account siblings to nodes that are finished! yes, try that!
      let completeBoards = [];
      let incompleteBoards = [];
      for(let pos=0; pos<board.length; pos++) {
        if(board[pos] === conf.empty) {
          let childBoard = board.substring(0,pos) + currentPlayer + board.substring(pos+1);
          if(getBoardStatus(childBoard) === conf.status.on) {
            incompleteBoards.push(childBoard);
          } else {
            completeBoards.push(childBoard);
          }
        }
      }

      // if one or more of the children are win|loss then remove the others
      // is none is win|loss then keep all
      for(let childBoard of completeBoards) {
        nodes[childBoard] = {};
      }
      // if(completeBoards.length === 0) {
        for(let childBoard of incompleteBoards) {
          nodes[childBoard] = {};
        }
      // }

      keys = Object.keys(nodes);
    }
  }
}

function getBoardStatus(board) {
  let status = conf.status.on;

  if(isWin(board)) {
    status = conf.status.win;
  } else if (isLoss(board)) {
    status = conf.status.loss;
  } else if (board.split("").filter(s=>s===conf.empty).length === 0) {
    status = conf.status.draw;
  }

  return status;
}

function isWin(board) {
  for(const w of conf.wins) {
    const exp = new RegExp(w);
    if(exp.test(board)) {
      return true;
    }
  }
  return false;  
}

function isLoss(board) {
  for(const l of conf.losses) {
    const exp = new RegExp(l);
    if(exp.test(board)) {
      return true;
    }
  }
  return false;
}
