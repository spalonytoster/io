// jshint esversion: 6
let maze;

function setup() {
  createCanvas(400, 400);
  let size = 40;
  let cols = floor(width/size);
  let rows = floor(height/size);
  maze = new Maze(cols, rows, size);
  maze.generate();
  emptyMaze(maze);
  maze.setStart(0, 0);
  maze.setEnd(cols-1, rows-1);
}

function draw() {
  background(51);
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.show();
    });
  });
  noLoop();
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
