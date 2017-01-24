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

/// GenAlg utils ///
const DIRECTION = {
  up: 'U',
  right: 'R',
  down: 'D',
  left: 'L'
};

let globalCurrent;
let lastDirection;

function random(num) {
  return Math.floor(Math.random() * num);
}

function randomDirection() {
  let currentRandom = _.sample(DIRECTION);
  while (currentRandom === oppositeTo(lastDirection)) {
    currentRandom = _.sample(DIRECTION);
  }
  lastDirection = currentRandom;
  return currentRandom;
}

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // taxi cab metric
}

function makeMove(cell, move, maze) {
  let x = cell.x;
  let y = cell.y;

  switch (move) {
    case DIRECTION.up: y--;
      break;
    case DIRECTION.down: y++;
      break;
    case DIRECTION.left: x--;
      break;
    case DIRECTION.right: x++;
      break;
  }
  return maze.cells[y][x];
}

function isMoveOutOfBounds(cell, move, maze) {
  if (move === DIRECTION.up && cell.y-1 < 0) {
    return true;
  }
  if (move === DIRECTION.down && cell.y+1 >= maze.rows) {
    return true;
  }
  if (move === DIRECTION.left && cell.x-1 < 0) {
    return true;
  }
  if (move === DIRECTION.right && cell.x+1 >= maze.cols) {
    return true;
  }
}

function isWallBetween(first, second) {
  let horizontalDirection = first.x - second.x;
  let verticalDirection;

  if (horizontalDirection) {
    if (horizontalDirection === -1) {
      if (first.walls.right) {
        return true;
      }
    }
    else {
      if (first.walls.left) {
        return true;
      }
    }
  }
  else {
    verticalDirection = first.y - second.y;
    if (verticalDirection === -1) {
      if (first.walls.bottom) {
        return true;
      }
    }
    else {
      if (first.walls.top) {
        return true;
      }
    }
  }
}

function oppositeTo(direction) {
  switch (direction) {
    case DIRECTION.up: return DIRECTION.down;
    case DIRECTION.down: return DIRECTION.up;
    case DIRECTION.left: return DIRECTION.right;
    case DIRECTION.right: return DIRECTION.left;
  }
}

function fitness1(entity) {
  let path = chromosomeToPath(entity);
  return (path.length * 10) * distance(maze.start, _.last(path));
}

function fitness2(entity) {
  let paths = chromosomeToPaths(entity);
  if (paths.touch) {
    return Infinity;
  }
  return ((paths.head.length * 10) * distance(_.first(paths.head), _.last(paths.head)) +
          (paths.tail.length * 10) * distance(_.last(paths.tail), _.first(paths.tail))) / 2;
}

function chromosomeToPath(chromosome) {
  let current = maze.start;
  let path = [new Cell(current.x, current.y, current.size)];
  for (let i = 0; i < chromosome.length; i++) {
    let move = chromosome[i];
    if (isMoveOutOfBounds(current, move, maze)) { break; }
    let afterMove = makeMove(current, move, maze);
    if (isWallBetween(current, afterMove)) { break; }
    let distanceToEnd = distance(current, maze.end);
    current = afterMove;
    path.push(new Cell(current.x, current.y, current.size));
    if (distanceToEnd === 0) { break; }
  }
  globalCurrent = current;
  return path;
}

function chromosomeToPaths(chromosome) {
  let head = maze.start;
  let tail = maze.end;

  let paths = {
    head: [new Cell(head.x, head.y, head.size)],
    tail: [new Cell(tail.x, tail.y, tail.size)]
  };

  let headFinished = false;
  let tailFinished = false;

  for (let i = 0; i < chromosome.length; i++) {
    if (headFinished && tailFinished) { break; }

    if (!headFinished) {
      headFinished = true;
      let move = chromosome[i];
      if (!isMoveOutOfBounds(head, move, maze)) {
        let afterMove = makeMove(head, move, maze);
        if (!isWallBetween(head, afterMove)) {
          headFinished = false;
          head = afterMove;
          paths.head.push(new Cell(head.x, head.y, head.size));

          if (_.includes(paths.tail, _.last(paths.head))) {
            paths.touch = true;
            break;
          }

          if (distance(head, maze.end) === 0) {
            break;
          }
        }
      }
    }

    if (!tailFinished) {
      tailFinished = true;
      let move = oppositeTo(chromosome[chromosome.length-1 - i]);
      if (!isMoveOutOfBounds(tail, move, maze)) {
        let afterMove = makeMove(tail, move, maze);
        if (!isWallBetween(tail, afterMove)) {
          tailFinished = false;
          tail = afterMove;
          paths.tail.unshift(new Cell(tail.x, tail.y, tail.size));

          if (_.includes(paths.head, _.first(paths.tail))) {
            paths.touch = true;
            break;
          }

          if (distance(tail, maze.start) === 0) {
            break;
          }
        }
      }
    }
  }
  return paths;
}
