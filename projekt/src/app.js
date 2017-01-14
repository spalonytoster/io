// jshint esversion: 6
let maze;
let aStar;
let cellSize = 40

function setup() {
  createCanvas(400, 400);
  // frameRate(10);

  let cols = floor(width/cellSize);
  let rows = floor(height/cellSize);

  maze = new Maze(cols, rows, cellSize);
  maze.generate();
  // emptyMaze(maze);
  maze.setStart(0, 0);
  maze.setEnd(cols-1, rows-1);

  aStar = new AStar(maze);
}

function draw() {
  background(200);

  drawCells(aStar.maze);

  if (aStar.openSet.length > 0) {
    aStar.nextStep();
  }

  aStar.closedSet.forEach((cell) => {
    cell.show([255, 0, 0]);
  });

  aStar.openSet.forEach((cell) => {
    cell.show([0, 255, 0]);
  });

  if (aStar.current === aStar.maze.end) {
    background(200);
    drawCells(aStar.maze);
    let path = [];
    let previous = aStar.current.previous;
    while (previous) {
      path.push(previous);
      previous = previous.previous;
    }
    drawPath(path);
    noLoop();
  }
}

function emptyMaze(maze) {
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.walls.top = false;
      cell.walls.right = false;
      cell.walls.bottom = false;
      cell.walls.left = false;
    });
  });
}

function drawPath(path) {
  let w = cellSize;
  noFill();
  stroke(255, 0, 0, 100);
  strokeWeight(w / 2);
  beginShape();
  path.forEach((elt) => {
    vertex(elt.x * w + w / 2, elt.y * w + w / 2);
  });
  endShape();
}

function drawCells(maze) {
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.show();
    });
  });
}
