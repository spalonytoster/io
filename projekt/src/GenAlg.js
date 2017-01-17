// jshint esversion: 6
const DIRECTION = {
  up: 'U',
  right: 'R',
  down: 'D',
  left: 'L'
};

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
      skip: 20
    };

    genetic.seed = () => {
      let cols = this.userData.maze.cols;
      let rows = this.userData.maze.rows;
      // maximum chromosome length will be the amount of cells in the maze
      let chromosomeLength = this.random(cols * rows);
      let chromosome = [];
      for (let i = 0; i < chromosomeLength; i++) {
        chromosome.push(this.randomDirection());
      }
      return chromosome;
    };

    genetic.mutate = (chromosome) => {
      let replaceAt = (str, index, character) => {
        return str.substr(0, index) + character + str.substr(index + character.length);
      };
      let index = this.random(chromosome.length);
      return replaceAt(entity, index, this.randomDirection());
    };

    genetic.crossover = function(mother, father) {
    	// two-point crossover
    	var len = mother.length;
    	var ca = this.random(len);
    	var cb = this.random(len);
    	if (ca > cb) {
    		let tmp = cb;
    		cb = ca;
    		ca = tmp;
    	}

    	let son = father.substr(0, ca) + mother.substr(ca, cb-ca) + father.substr(cb);
    	let daughter = mother.substr(0, ca) + father.substr(ca, cb-ca) + mother.substr(cb);

    	return [son, daughter];
    };

    genetic.fitness = (chromosome) => {
      let maze = this.userData.maze;
      let cells = maze.cells;
      let fitness = Infinity;
      let current = maze.start;
    	chromosome.forEach((move) => {
        if (!this.isOutOfBounds(current, after, maze)) {
          let afterMove = this.makeMove(current, move, maze);
          if (!maze.isWallBetween(current, afterMove)) {
            current = afterMove;
            fitness = this.distance(current, maze.end);
          }
        }
      });
      return fitness;
    };

    genetic.generation = (pop, generation, stats) => {
    	// stop running once we've reached the solution
      return this.distance(this.furthestPoint(pop[0].chromosome)) !== 0.0;
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
      // todo
    };
  }

  run() {
    let userData = {
      maze: this.maze
    };
    // TODO; najprawdopodobniej trzeba przekazywac obiekt parsowalny do jsona
    this.genetic.evolve(this.config, userData);
  }

  random(num) {
    return Math.floor(Math.random() * num);
  }

  randomDirection() {
    return _.sample(DIRECTION);
  }

  distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // taxi cab metric
  }

  furthestPoint(chromosome) {
    let result = {
      x: 0,
      y: 0
    };
    return result;
  }

  makeMove(cell, move, maze) {
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
    return maze.cells[x][y];
  }

  isMoveOutOfBounds(cell, move, maze) {
    if (move === DIRECTION.up && cell.y-1 < 0) {
      return true;
    }
    if (move === DIRECTION.down && cell.y+1 >= maze.rows) {
      return true;
    }
    if (move === DIRECTION.left && cell.x-1 < 0) {
      return true;
    }
    if (move === DIRECTION.up && cell.x+1 >= maze.cols) {
      return true;
    }
  }

}
