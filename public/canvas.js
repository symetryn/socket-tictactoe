// import utils from "./utils";

const socket = io("https://sockettictac.herokuapp.com");

socket.on("game-state", data => {
  turnActive = true;
  grid = data;
  checkGameOver();
  // console.log(data);
  drawCurrentGrid();
  if (!gameOver) {
    togglePlayer();
  }
  // if (gameOver) {
  //   console.log("Congratulations " + currentPlayer);
  //   message.innerHTML = "Congratulations " + currentPlayer;
  // }

  console.log("size" + checkfill());
  // checkGameOver();
});

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const reset = document.querySelector(".reset");
const message = document.querySelector(".message");
message.innerHTML = "Player X turn";
var p = -0.5;
let dimension = 100;
let rc = 3;
let width = dimension * rc;
let height = dimension * rc;
let players = ["X", "O"];
let currentPlayer = players[0];
let gameOver = false;
let turnActive = true;
canvas.width = width;
canvas.height = height;
let grid = [["", "", ""], ["", "", ""], ["", "", ""]];

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners

reset.addEventListener("click", e => {
  turnActive = true;
  message.innerHTML = "Player X turn";
  gameOver = false;
  currentPlayer = players[0];
  c.clearRect(0, 0, width, height);
  grid = [["", "", ""], ["", "", ""], ["", "", ""]];
  init();
});

addEventListener("mousemove", event => {
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
});

canvas.addEventListener("click", e => {
  if (!gameOver) {
    makeMove(e);
  }
});

function makeMove(e) {
  if (turnActive) {
    turnActive = false;
    console.log(grid);
    if (checkfill() >= 8) console.log("Draw");
    c.fillStyle = "black";
    console.log(checkfill());
    c.font = "40px sans-serrif";

    drawPlayerMove();

    checkGameOver();
    // if (gameOver) {
    //   console.log("Congratulations " + currentPlayer);
    //   message.innerHTML = "Congratulations " + currentPlayer;
    // }
  }
}
function togglePlayer() {
  currentPlayer === players[1]
    ? (currentPlayer = players[0])
    : (currentPlayer = players[1]);
  if (!gameOver) message.innerHTML = "Player " + currentPlayer + " turn";
}
function drawPlayerMove() {
  let clickX = Math.floor(mouse.x / dimension) * dimension + dimension / 2 - 15;
  let clickY = Math.floor(mouse.y / dimension) * dimension + dimension / 2 + 15;
  if (
    grid[Math.floor(clickY / dimension)][Math.floor(clickX / dimension)] == ""
  ) {
    c.fillText(currentPlayer, clickX, clickY);
    grid[Math.floor(clickY / dimension)][
      Math.floor(clickX / dimension)
    ] = currentPlayer;

    if (!gameOver) {
      togglePlayer();
    }
    socket.emit("send-current-grid", grid);
  } else {
    turnActive = true;
  }
  //update grid
}

function drawCurrentGrid() {
  // let clickX = Math.floor(mouse.x / dimension) * dimension + dimension / 2 - 15;
  // let clickY = Math.floor(mouse.y / dimension) * dimension + dimension / 2 + 15;
  // if (
  //   grid[Math.floor(clickY / dimension)][Math.floor(clickX / dimension)] == ""
  // ) {
  //   c.fillText(currentPlayer, clickX, clickY);
  // }
  // //update grid
  // grid[Math.floor(clickY / dimension)][
  //   Math.floor(clickX / dimension)
  // ] = currentPlayer;
  c.fillStyle = "black";
  c.font = "40px sans-serrif";
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (grid[i][j] !== "") {
        c.fillText(
          grid[i][j],
          j * dimension + dimension / 2 - 15,
          i * dimension + dimension / 2 + 15
        );
      }
    }
  }
}

function checkfill() {
  var size = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      // console.log(`${i} and ${j} ` + grid[i][j]);
      if (grid[i][j] !== "") size++;
    }
  }

  return size;
}

// addEventListener("resize", () => {
//   canvas.width = innerWidth;
//   canvas.height = innerHeight;

//   init();
// });

// Implementation

function init() {
  // objects = [];

  // for (let i = 0; i < 400; i++) {
  //   // objects.push()
  // }
  drawBoard();
}
function drawBoard() {
  for (var x = dimension; x < width; x += dimension) {
    c.moveTo(0.5 + x + p, p);
    c.lineTo(0.5 + x + p, height + p);
  }

  for (var x = dimension; x < height; x += dimension) {
    c.moveTo(p, 0.5 + x + p);
    c.lineTo(width + p, 0.5 + x + p);
  }
  c.strokeStyle = "black";
  c.stroke();
}

function checkGameOver() {
  for (elem of players) {
    if (grid[0][0] == elem && grid[0][1] == elem && grid[0][2] == elem) {
      gameOver = true;
    } else if (grid[1][0] == elem && grid[1][1] == elem && grid[1][2] == elem) {
      gameOver = true;
    } else if (grid[2][0] == elem && grid[2][1] == elem && grid[2][2] == elem) {
      gameOver = true;
    }

    if (grid[0][0] == elem && grid[1][0] == elem && grid[2][0] == elem) {
      gameOver = true;
    } else if (grid[0][1] == elem && grid[1][1] == elem && grid[2][1] == elem) {
      gameOver = true;
    } else if (grid[0][2] == elem && grid[1][2] == elem && grid[2][2] == elem) {
      gameOver = true;
    }

    if (grid[0][0] == elem && grid[1][1] == elem && grid[2][2] == elem) {
      gameOver = true;
    } else if (grid[0][2] == elem && grid[1][1] == elem && grid[2][0] == elem) {
      gameOver = true;
    }
    if (checkfill() >= 8 && gameOver) message.innerHTML = "Draw";

    if (gameOver) {
      message.innerHTML = "Congratulation " + elem;
      break;
    }
  }

  // if (grid[0][0] == 1 && grid[1][0] == 1 && grid[2][0] == 1) {
  //   gameOver = true;
  // } else if (grid[0][1] && grid[1][1] == 1 && grid[2][1] == 1) {
  //   gameOver = true;
  // } else if (grid[2][0] == 1 && grid[2][1] == 1 && grid[2][2] == 1) {
  //   gameOver = true;
  // }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  //   c.clearRect(0, 0, canvas.width, canvas.height);

  //   c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);
  // objects.forEach(object => {
  //  object.update()
  // })
}

init();
animate();
