// jshint esversion: 6

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

function drawPath(path, cellSize, sketch) {
  let w = cellSize;
  sketch.noFill();
  sketch.stroke(255, 0, 0, 100);
  sketch.strokeWeight(w / 2);
  sketch.beginShape();
  path.forEach((elt) => {
    sketch.vertex(elt.x * w + w / 2, elt.y * w + w / 2);
  });
  sketch.endShape();
}

function drawCells(maze) {
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.show();
    });
  });
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function copyFromMaze(oldMaze, newMaze) {
  let rows = [];
  oldMaze.cells.forEach((row) => {
    let newRow = [];
    row.forEach((c) => {
      let newCell = new Cell(c.x, c.y, c.size);
      newCell.walls = jQuery.extend({}, c.walls);
     newRow.push(newCell);
    });
    rows.push(newRow);
  });
  newMaze.cells = rows;
}
