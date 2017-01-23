// jshint esversion: 6
const DIRECTION = {
  up: 'U',
  right: 'R',
  down: 'D',
  left: 'L'
};

let globalCurrent;
let lastDirection;

class GenAlg {
  constructor(maze, sketch) {
    this.maze = maze;
    this.sketch = sketch;
    this.genetic = Genetic.create();
  }

  init() {
    let genetic = this.genetic;
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    this.config = {
      iterations: 4000,
      size: 250,
      crossover: 0.5,
      mutation: 0.5,
      skip: 10000,
      webWorkers: false
    };

    genetic.seed = function() {
      let cols = this.userData.maze.cols;
      let rows = this.userData.maze.rows;
      // maximum entity length will be the amount of cells in the maze
      // let chromosomeLength = cols-1 + rows;
      let chromosomeLength = cols * rows - 1;
      let entity = [];
      for (let i = 0; i < chromosomeLength; i++) {
        entity.push(randomDirection());
      }
      return entity;
    };

    genetic.mutate = function(entity) {
      let replaceAt = (arr, index, character) => {
        arr[index] = character;
        return arr;
      };
      let index = random(entity.length);
      return replaceAt(entity, index, randomDirection());
    };

    genetic.crossover = function(mother, father) {
    	// Single-point crossover
      // https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Single-point_crossover
    	let len = mother.length;
      let splitIndex = Math.floor(len / 2) - 1;

      let son = father.slice(0, splitIndex).concat(mother.slice(splitIndex, len));
      let daughter = mother.slice(0, splitIndex).concat(father.slice(splitIndex, len));

    	return [son, daughter];
    };

    genetic.fitness = fitness;

    genetic.generation = function(pop, generation, stats) {
      console.log('generation: ', generation);
    	// stop running once we've reached the solution
      let paths = chromosomeToPaths(pop[0].entity);
      return !paths.touch;
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
        if (isFinished) {
          let paths = chromosomeToPaths(pop[0].entity);
          console.log(paths);
          drawPath(paths.head, maze.start.size, geneticSketch);
          drawPath(paths.tail, maze.start.size, geneticSketch);
        }
    };
  }

  run() {
    let rows = [];
    this.maze.cells.forEach((row) => {
      let newRow = [];
      row.forEach((c) => {
        let newCell = new Cell(c.x, c.y, c.size);
        newCell.walls = jQuery.extend({}, c.walls);
        newRow.push(newCell);
      });
      rows.push(newRow);
    });

    let start = new Cell(this.maze.start.x, this.maze.start.y, this.maze.start.size);
    start.walls = jQuery.extend({}, this.maze.start.walls);
    let end = new Cell(this.maze.end.x, this.maze.end.y, this.maze.end.size);
    end.walls = jQuery.extend({}, this.maze.end.walls);

    let userData = {
      maze: {
        cells: rows,
        cols: this.maze.cols,
        rows: this.maze.rows,
        start: start,
        end: end
      }
    };
    this.genetic.evolve(this.config, userData);
  }
}

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

function fitness(entity) {
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

          if (_.last(paths.head) === _.first(paths.tail)) {
            paths.touch = true;
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

          if (_.last(paths.head) === _.first(paths.tail)) {
            paths.touch = true;
            break;
          }
        }
      }
    }
  }
  return paths;
}
