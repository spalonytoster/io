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
    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    this.config = {
      iterations: 4000,
      size: 250,
      crossover: 0.3,
      mutation: 0.3,
      skip: 10000,
      webWorkers: false
    };

    genetic.seed = function() {
      let cols = this.userData.maze.cols;
      let rows = this.userData.maze.rows;
      // maximum entity length will be the amount of cells in the maze
      // let chromosomeLength = random(cols * rows);
      // let chromosomeLength = cols-1 + rows;
      let chromosomeLength = cols * rows;
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
    	// two-point crossover
      // https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Two-point_crossover
    	var len = mother.length;
    	var ca = random(len);
    	var cb = random(len);
    	if (ca > cb) {
    		let tmp = cb;
    		cb = ca;
    		ca = tmp;
    	}

      let son = father.slice(0, ca).concat(mother.slice(ca, cb)).concat(father.slice(cb, father.length));
      let daughter = mother.slice(0, ca).concat(father.slice(ca, cb)).concat(mother.slice(cb, mother.length));

    	return [son, daughter];
    };

    genetic.fitness = fitness;

    genetic.generation = function(pop, generation, stats) {
      console.log('generation: ', generation);
    	// stop running once we've reached the solution
      // return distance(globalCurrent, this.userData.maze.end) !== 0;
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
      let notificationDebug = {
      		pop: pop,
      		generation: generation,
      		stats: stats,
      		isFinished: isFinished
      	};
        console.log(pop[0].entity);
        console.log(pop[0].fitness);
        if (isFinished) {
          drawPath(chromosomeToPath(pop[0].entity), maze.start.size, geneticSketch);
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
  if (move === DIRECTION.up) {
    y--;
  }
  if (move === DIRECTION.down) {
    y++;
  }
  if (move === DIRECTION.left) {
    x--;
  }
  if (move === DIRECTION.right) {
    x++;
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
  if (DIRECTION.up === direction) {
    return DIRECTION.down;
  }
  if (DIRECTION.down === direction) {
    return DIRECTION.up;
  }
  if (DIRECTION.left === direction) {
    return DIRECTION.right;
  }
  if (DIRECTION.right === direction) {
    return DIRECTION.left;
  }
}

function fitness(entity) {
  let path = chromosomeToPath(entity);
  return distance(_.last(path), maze.end);
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
