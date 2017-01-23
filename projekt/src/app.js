// jshint esversion: 6
let aStarSketch, geneticSketch, geneticSketch2;
let maze;
let cellSize;

let sketchHeight, sketchWidth;
let rows, cols;

let genAlg;
let genAlg2;

$(() => {
  // initialization
  sketchHeight = Number.parseInt($('#controls #sketch-height').val(), 10);
  sketchWidth = Number.parseInt($('#controls #sketch-width').val(), 10);
  cellSize = Number.parseInt($('#controls #cell-size').val(), 10);

  rows = Math.floor(sketchHeight / cellSize);
  cols = Math.floor(sketchWidth / cellSize);

  maze = new Maze(cols, rows, cellSize);
  maze.generate();
  // emptyMaze(maze);
  maze.setStart(0, 0);
  maze.setEnd(cols - 1, rows - 1);

  // A*
  let aStarSketchFun = (p) => {
    let aStar;
    p.setup = () => {
      p.createCanvas(400, 400);
      // p.frameRate(10);
      let aStarMaze = new Maze(cols, rows, cellSize);
      copyFromMaze(maze, aStarMaze);
      aStarMaze.setStart(0, 0);
      aStarMaze.setEnd(cols - 1, rows - 1);
      aStarMaze.injectSketch(p);
      aStar = new AStar(aStarMaze);
    };

    p.draw = () => {
      p.background(200);

      drawCells(aStar.maze);

      if (aStar.openSet.length > 0) {
        // source of algorithm progress
        aStar.nextStep();
      }

      aStar.closedSet.forEach((cell) => {
        cell.show([255, 0, 0]);
      });

      aStar.openSet.forEach((cell) => {
        cell.show([0, 255, 0]);
      });

      if (aStar.current === aStar.maze.end) {
        p.background(200);
        drawCells(aStar.maze);
        let path = [];
        let previous = aStar.current.previous;
        while (previous) {
          path.push(previous);
          previous = previous.previous;
        }
        path.unshift(aStar.maze.end);
        drawPath(path, cellSize, p);
        p.noLoop();
      }
    };
  };
  aStarSketch = new p5(aStarSketchFun, 'astar');
  aStarSketch._loop = false;

  // Genetic
  let geneticSketchFun = (p) => {
    p.setup = () => {
      p.createCanvas(400, 400);
      // p.frameRate(10);

      let geneticMaze = new Maze(cols, rows, cellSize);
      copyFromMaze(maze, geneticMaze);
      geneticMaze.setStart(0, 0);
      geneticMaze.setEnd(cols - 1, rows - 1);
      geneticMaze.injectSketch(p);
      genAlg = new GenAlg(geneticMaze, p);
      genAlg.init();
    };

    p.draw = () => {
      p.background(200);
      drawCells(genAlg.maze);

      p.noLoop();
    };
  };

  geneticSketch = new p5(geneticSketchFun, 'genetic');
  geneticSketch._loop = false;

  // Genetic double-path
  let geneticSketchFun2 = (p) => {
    p.setup = () => {
      p.createCanvas(400, 400);
      // p.frameRate(10);

      let geneticMaze2 = new Maze(cols, rows, cellSize);
      copyFromMaze(maze, geneticMaze2);
      geneticMaze2.setStart(0, 0);
      geneticMaze2.setEnd(cols - 1, rows - 1);
      geneticMaze2.injectSketch(p);
      genAlg2 = new GenAlg2(geneticMaze2, p);
      genAlg2.init();
    };

    p.draw = () => {
      p.background(200);
      drawCells(genAlg2.maze);

      p.noLoop();
    };
  };

  geneticSketch2 = new p5(geneticSketchFun2, 'genetic2');
  geneticSketch2._loop = false;
});
