library(genalg)

data <- read.csv('./labirynth.csv', header = FALSE, sep = ',');
startingPoint <- c(2,2);

# ending point coordinates are needed to calculate distance
endingPoint <- c(10,7);
sizeX <- ncol(data); sizeY <- nrow(data);

interpretSingleMove <- function(currentCoords, moveCode) {
  result <- currentCoords;
  if (moveCode[1] == 1 & moveCode[2] == 1) {
    # print('UP');
    result[2] <- result[2] - 1;
  }
  else if (moveCode[1] == 0 & moveCode[2] == 0) {
    # print('DOWN');
    result[2] <- result[2] + 1;
  }
  else if (moveCode[1] == 0 & moveCode[2] == 1) {
    # print('RIGHT');
    result[1] <- result[1] + 1;
  }
  else if (moveCode[1] == 1 & moveCode[2] == 0) {
    # print('LEFT');
    result[1] <- result[1] - 1;
  }

  if (result[1] > 0 & result[2] > 0) {
    return(result);
  }
  else {
    return(NULL);
  }
};

calculateDistance <- function(coordsA, coordsB) {
  return(sqrt((coordsB[1] - coordsA[1])^2 + (coordsB[2] - coordsA[2])^2));
};

fitnessFunction <- function(chromosome) {
  chromosomeSize <- NROW(chromosome);

  positionCoords <- startingPoint;
  positionValue <- data[positionCoords[2], positionCoords[1]];

  for (i in seq(1, chromosomeSize, by=2)) {
    coords <- interpretSingleMove(positionCoords, c(chromosome[i], chromosome[i+1]));
    coordsValue <- data[coords[2],coords[1]];
    if (coordsValue != '_' & coordsValue != 'X') {
      dist <- -calculateDistance(startingPoint, positionCoords);
      # print(dist);
      return(dist);
    }
    positionCoords <- coords;
    positionValue <- coordsValue;
  }
  dist <- -calculateDistance(startingPoint, positionCoords);
  # print(dist);
  return();
};

# solution
# chromosome <- c(0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0);
# chromosome <- c(0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0);
# fitnessFunction(chromosome);

GAmodel <- rbga.bin(
  size = 30,
  popSize = 50000,
  iters = 5,
  mutationChance = 0.01,
  elitism = T,
  evalFunc = fitnessFunction
  # ,verbose = TRUE
);

summary(GAmodel, echo=TRUE);
