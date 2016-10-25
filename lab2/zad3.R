library(genalg);
data <- read.csv('./formula1.csv', header = FALSE, sep = ',');

fitnessFunction <- function(chromosome) {
  result <- 0;
  chromosomeSize <- NROW(chromosome);

  for (i in 1:nrow(data)) {
    conditions <- c(NULL, NULL, NULL);
    for (j in 1:3) {
      value <- data[i,j];
      if (value > 0) {
        condition <- 1;
      }
      else if (value < 0) {
        condition <- 0;
      }
      else {
        # err
        break;
      }
      conditions[j] <- condition;
    }
    # c(0,1,1)

  }

  print(result);
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
