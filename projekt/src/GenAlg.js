// jshint esversion: 6

class GenAlg {
  constructor(maze, sketch) {
    this.maze = maze;
    this.sketch = sketch;
    this.genetic = Genetic.create();
  }

  init() {
    let genetic = this.genetic;
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Fittest;
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

    genetic.fitness = fitness1;

    genetic.generation = function(pop, generation, stats) {
      console.log('generation: ', generation);
    	// stop running once we've reached the solution
      return distance(globalCurrent, this.userData.maze.end) !== 0;
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
