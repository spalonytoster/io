// jshint esversion: 6

class Cell {
  constructor(x, y, size, sketch) {
    this.sketch = sketch;
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
    let p = this.sketch;
    let size = this.size;
    let x = this.x * size;
    let y = this.y * size;
    p.stroke(0);

    if (this.walls.top) {
      p.line(x, y, x+size, y);
    }
    if (this.walls.right) {
      p.line(x+size, y, x+size, y+size);
    }
    if (this.walls.bottom) {
      p.line(x, y+size, x+size, y+size);
    }
    if (this.walls.left) {
      p.line(x, y, x, y+size);
    }

    // size = size - 2;

    // if (this.visited) {
    //   noStroke();
    //   fill(255, 0, 255, 100);
    //   rect(x, y, size, size);
    // }

    if (color) {
      p.noStroke();
      p.fill.call(p, color);
      p.rect(x, y, size, size);
    }

    if (this.isStart) {
      p.noStroke();
      p.fill(0, 255, 0, 100);
      p.rect(x, y, size, size);
    }

    if (this.isEnd) {
      p.noStroke();
      p.fill(0, 255, 0, 100);
      p.rect(x, y, size, size);
    }
  }
}

// export default Cell;
