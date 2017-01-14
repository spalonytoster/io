// jshint esversion: 6
let maze;
let aStar;

function setup() {
  createCanvas(400, 400);

  let size = 10;
  let cols = floor(width/size);
  let rows = floor(height/size);

  maze = new Maze(cols, rows, size);
  maze.generate();
  // emptyMaze(maze);
  maze.setStart(0, 0);
  maze.setEnd(cols-1, rows-1);

  aStar = new AStar(maze);
}

function draw() {
  background(51);
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.show();
    });
  });
  if (aStar.openSet.length > 0) {
    aStar.nextStep();
  }

  aStar.closedSet.forEach((cell) => {
    cell.show([255, 0, 0]);
  });

  aStar.openSet.forEach((cell) => {
    cell.show([255, 0, 0]);
  });

  if (aStar.current === aStar.maze.end) {
    let previous = aStar.current.previous;
    while (previous) {
      previous.show([0, 0, 255]);
      previous = previous.previous;
    }
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
