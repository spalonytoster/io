library(genalg)

dataset <- data.frame(
  item = c(
    "pocketknife",
    "beans",
    "potatoes",
    "unions",
    "sleeping bag",
    "rope",
    "compass"
  ),
  survivalpoints = c(10, 20, 15, 2, 30, 10, 30),
  weight = c(1, 5, 10, 1, 7, 5, 1)
);

weightlimit <- 20;

fitnessFunc <- function(x) {
  survivalPoints <- x %*% dataset$survivalpoints
  weight <- x %*% dataset$weight

  if (weight > weightlimit) {
    return(0)
  }
  else {
    return(-survivalPoints)
  }
};

GAmodel <- rbga.bin(
  size = 7,
  popSize = 200,
  iters = 100,
  mutationChance = 0.01,
  elitism = T,
  evalFunc = fitnessFunc
);

summary(GAmodel, echo=TRUE);
