library(genalg);

fitnessFunction <- function(chromosome) {
  result <- 0;
  x1 <- chromosome[1];
  x2 <- chromosome[2];
  x3 <- chromosome[3];
  x4 <- chromosome[4];

  # 1st condition
  if (!x1 | x2 | x4) {
    result <- result - 1;
  }

  # 2nd condition
  if (!x2 | x3 | x4) {
    result <- result - 1;
  }

  # 3rd condition
  if (x1 | !x3 | x4) {
    result <- result - 1;
  }

  # 4th condition
  if (x1 | !x2 | !x4) {
    result <- result - 1;
  }

  # 5th condition
  if (x2 | !x3 | !x4) {
    result <- result - 1;
  }

  # 6th condition
  if (!x1 | x3 | !x4) {
    result <- result - 1;
  }

  # 7th condition
  if (x1 | x2 | x3) {
    result <- result - 1;
  }
  # print(result);
  return(result);
};

# chromosome <- c(1,1,1,0);
# fitnessFunction(chromosome);

GAmodel <- rbga.bin(
  size = 4,
  popSize = 256,
  iters = 5,
  mutationChance = 0.01,
  elitism = T,
  evalFunc = fitnessFunction
  # ,verbose = TRUE
);

summary(GAmodel, echo=TRUE);
