// jshint esversion: 6

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

    // A star properties
    this.gScore = Infinity;
    this.fScore = Infinity;
  }

  show(color) {
    let size = this.size;
    let x = this.x * size;
    let y = this.y * size;
    stroke(0);

    if (this.walls.top) {
      line(x, y, x+size, y);
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

    // size = size - 2;

    // if (this.visited) {
    //   noStroke();
    //   fill(255, 0, 255, 100);
    //   rect(x, y, size, size);
    // }

    if (color) {
      noStroke();
      fill.call(this, color);
      rect(x, y, size, size);
    }

    if (this.isStart) {
      noStroke();
      fill(0, 255, 0, 100);
      rect(x, y, size, size);
    }

    if (this.isEnd) {
      noStroke();
      fill(0, 255, 0, 100);
      rect(x, y, size, size);
    }
  }
}

// export default Cell;