// jshint esversion: 6
let maze;

function setup() {
  createCanvas(400, 400);
  let size = 40;
  let cols = floor(width/size);
  let rows = floor(height/size);
  // frameRate(10);
  maze = new Maze(cols, rows, size);
  maze.init();
}

function draw() {
  background(51);
  maze.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.show();
    });
  });
  maze.moveToNext();
}

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
    this.current = this.cells[0][0];
    this.current.visited = true;
  }

  getCurrentNeighbours() {
    let cell = this.current;
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
    let neighbours = this.getCurrentNeighbours(cell);
    neighbours.forEach((neighbour) => {
      if (!neighbour.visited) {
        unvisitedNeighbours.push(neighbour);
      }
    });
    return unvisitedNeighbours;
  }

  moveToNext() {
    let availableCells = this.getCurrentUnvisitedNeighbours();
    if (availableCells.length === 0) {
      // TODO: handle that shit
      return false;
    }
    let index = floor(random(0, availableCells.length));
    this.current = availableCells[index];
    this.current.visited = true;
    return this.current;
  }
}

class Cell {
  constructor(x, y, size) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    this.visited = false;
  }

  show() {
    let size = this.size;
    let x = this.x * size;
    let y = this.y * size;
    stroke(255);

    if (this.walls.top) {
      line(x, y, x+size, y );
    }
    if (this.walls.right) {
      line(x+size, y, x+size, y+size);
    }
    if (this.walls.bottom) {
      line(x, y+size, x+size, y+size);
    }
    if (this.walls.left) {
      line(x, y, x, y+size);
    }

    if (this.visited) {
      fill(255, 0, 255, 100);
      rect(x, y, size, size);
    }
  }
}
