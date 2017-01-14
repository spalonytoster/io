// jshint esversion: 6

class AStar {
  constructor(maze) {
    this.maze = maze;
    this.current;
    this.closedSet = [];
    this.openSet = [maze.start];
    maze.start.gScore = 0;
    maze.start.fScore = this.heuristic(maze.start, maze.end);
  }

  heuristic(a, b) {
    return this.distanceBetween(a, b);
  }

  distanceBetween(a, b) {
    // return dist(a.i, a.j, b.i, b.j); // euclidean metric
    return abs(a.x - b.x) + abs(a.y - b.y); // taxi cab metrix
  }

  reconstructPath() {
    console.log(this.current);
  }

  nextStep() {
    // current is the one with the lowest fScore in openSet
    let current = _.minBy(this.openSet, (cell) => cell.fScore);
    this.current = current;
    if (current === this.end) {
      this.reconstructPath(current);
    }
    _.remove(this.openSet, current);
    this.closedSet.push(current);

    let neighbours = this.maze.getNonBlockedNeighbours(current);
    neighbours.forEach((neighbour) => {
      if (_.includes(this.closedSet, neighbour)) {
        // neighbour has been already evaluated, we skip
        return;
      }
      let gScore = current.gScore + this.distanceBetween(current, neighbour);
      if (!_.includes(this.openSet, neighbour)) {
        this.openSet.push(neighbour);
      }
      else if (gScore >= neighbour.gScore) {
        // this is not a better path
        return;
      }
      neighbour.previous = current;
      neighbour.gScore = gScore;
      neighbour.fScore = neighbour.gScore + this.heuristic(neighbour, this.maze.end);
    });
  }
}
