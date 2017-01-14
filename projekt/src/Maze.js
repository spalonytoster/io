// jshint esversion: 6
// import Cell from './Cell.js';

class Maze {
  constructor(cols, rows, cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
    this.cellSize = cellSize;
  }

  init() {
    for (let y = 0; y < this.rows; y++) {
      let row = [];
      for (let x = 0; x < this.cols; x++) {
        let cell = new Cell(x, y, this.cellSize);
        row.push(cell);
      }
      this.cells.push(row);
    }
    this.stack = [];
    this.current = this.cells[0][0];
    this.current.visited = true;
    this.current.isCurrent = true;
    this.stack.push(this.current);
  }

  getNeighbours(cell) {
    if (!cell) {
      cell = this.current;
    }
    let neighbours = [];
    if (cell.x > 0) {
      neighbours.push(this.cells[cell.y][cell.x-1]);
    }
    if (cell.x < this.cols-1) {
      neighbours.push(this.cells[cell.y][cell.x+1]);
    }
    if (cell.y > 0) {
      neighbours.push(this.cells[cell.y-1][cell.x]);
    }
    if (cell.y < this.rows-1) {
      neighbours.push(this.cells[cell.y+1][cell.x]);
    }
    return neighbours;
  }

  getCurrentUnvisitedNeighbours(cell) {
    let unvisitedNeighbours = [];
    let neighbours = this.getNeighbours(cell);
    neighbours.forEach((neighbour) => {
      if (!neighbour.visited) {
        unvisitedNeighbours.push(neighbour);
      }
    });
    return unvisitedNeighbours;
  }

  getNonBlockedNeighbours(cell) {
    let nonBlockedNeighbours = [];
    let neighbours = this.getNeighbours(cell);
    neighbours.forEach((neighbour) => {
      if (!this.isWallBetween(cell, neighbour)) {
        nonBlockedNeighbours.push(neighbour);
      }
    });
    return nonBlockedNeighbours;
  }

  moveToNext() {
    let availableCells = this.getCurrentUnvisitedNeighbours();
    if (availableCells.length === 0) {
      if (this.stack.length === 0) {
        return false;
      }
      this.current = this.stack.pop();
      return true;
    }
    let index = floor(random(0, availableCells.length));
    let nextCell = availableCells[index];

    this.removeWallsBetween(this.current, nextCell);
    this.current.isCurrent = false;
    nextCell.isCurrent = true;
    this.stack.push(this.current);

    this.current = nextCell;
    this.current.visited = true;
    return true;
  }

  removeWallsBetween(first, second) {
    let horizontalDirection = first.x - second.x;
    let verticalDirection;

    if (horizontalDirection) {
      if (horizontalDirection === -1) {
        first.walls.right = false;
        second.walls.left = false;
      }
      else {
        first.walls.left = false;
        second.walls.right = false;
      }
    }
    else {
      verticalDirection = first.y - second.y;
      if (verticalDirection === -1) {
        first.walls.bottom = false;
        second.walls.top = false;
      }
      else {
        first.walls.top = false;
        second.walls.bottom = false;
      }
    }
  }

  isWallBetween(first, second) {
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

  generate() {
    this.init();
    while(this.moveToNext()) { }
  }

  setStart(i, j) {
    this.start = this.cells[i][j];
    this.start.isStart = true;
  }

  setEnd(i, j) {
    this.end = this.cells[i][j];
    this.end.isEnd = true;
  }
}

// export default Maze;
