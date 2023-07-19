import SVG from "./SVG.js";
import minmax from "./minmax.js";
// const log = console.log;
const log = s => {};
const conf = { w:3, h:3, pMax:"X", pMin:"O", empty:".", };
const dom = { board: undefined, tiles: undefined, style: undefined, };
const state = { gameOn: undefined, player: undefined, };

document.addEventListener("DOMContentLoaded", () => {

  initDOM();
  initState();
  renderTiles();
  renderStyle();
  startGame();

  dom.start.addEventListener("click", startGame);
  dom.player[0].addEventListener("change", startGame);
  dom.player[1].addEventListener("change", startGame);
  for(let i=0; i<dom.tiles.length; i++) {
    dom.tiles[i].addEventListener("click", handleTileClick);
  }

});

function startGame() {
  // clear board
  for(let i=0; i<dom.tiles.length; i++) {
    dom.tiles[i].className = "";
  }

  // clear win/lost/draw classes
  dom.board.className = "board";

  // get player
  if(dom.player[0].checked) {
    state.player = conf.pMax;
  } else {
    state.player = conf.pMin;
  }

  state.gameOn = true;

  if(state.player === conf.pMin) {
    // start with random tile
    dom.tiles[Math.floor(Math.random()*9)].className = conf.pMax;
  }
}

function computerTurn() {
  state.gameOn = false;
  let board = getBoard();

  // get children nodes
  let children = getChildren(board);

  // get scores for children nodes
  let scores = getScores(children, state.player);
  log(scores);

  // find out how many moves have the same highscore
  // to be able to selct randomly between these
  let alike = scores.filter(s=>s.score === scores[0].score).length;

  // place piece in sorted array
  scores[Math.floor(Math.random()*alike)].board.split("").map((val, i) => {
    if(val !== conf.empty) {
      dom.tiles[i].className = val;
    }
  });

  if(!isFinished()) {
    state.gameOn = true;
  }
}

function getScores(children, player) {
  let scores = [];
  for(const board of children) {
    scores.push({board:board, score:minmax[board].v});
  }

  if(player === conf.pMax) {
    scores.sort((a,b)=>a.score-b.score);
  } else {
    scores.sort((a,b)=>b.score-a.score);
  }
  return scores;
}

function getChildren(board) {
  let children = [];

  let currentPlayer = conf.pMax;
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

function getBoard() {
  let board = "";
  for(let i=0; i<dom.tiles.length; i++) {
    let className = dom.tiles[i].className;
    if(className === "") {
      board += ".";
    } else {
      board += className;
    }
  }
  return board;
}

function handleTileClick(e) {
  const el = e.target;
  if(state.gameOn) {
    state.gameOn = false;
    if(el.className === "") {
      el.className = state.player;
      if(!isFinished()) {
        computerTurn();
      }
    } else {
      state.gameOn = true;
    }
  }
}

function isFinished() {
  let board = getBoard();
  let status = minmax[board].s;

  if (status === "o") {
    // still ongoing
    return false;
  }

  if(state.player === conf.pMax) {
    dom.board.classList.add( { w: "won", l: "lost", d: "draw" }[status] );
  } else {
    dom.board.classList.add( { l: "won", w: "lost", d: "draw" }[status] );
  }
  return true;
}

function initDOM() {
  dom.board = document.querySelector(".board");
  dom.style = document.querySelector("style.once");
  dom.player = document.querySelectorAll("input[name=player]"); 
  dom.start = document.querySelector("button.start");
}

function initState() {
  state.gameOn = false;
}

function renderTiles() {
  let str = "";
  for(let i=0; i<conf.w*conf.h; i++) {
    str += `<button data-pos="${i}"></button>`;
  }
  dom.board.innerHTML = str;
  dom.tiles = document.querySelectorAll(".board button");
}

function renderStyle() {
  let visuals = 'stroke="black" stroke-width="5" fill="none"';
  dom.style.innerHTML = `
  .board button.${conf.pMax} {
    ${new SVG([
      `<path ${visuals} d="M10,10 l80,80 M10,90 l80,-80" />`
    ]).toBgImage()}
  }
  .board button.${conf.pMin} {
    ${new SVG([
      `<circle ${visuals} cx="50" cy="50" r="40" />`
    ]).toBgImage()}
  }
  `;
}

