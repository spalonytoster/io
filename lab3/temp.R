library(genalg);

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

iter<-100;
animate_plot <- function() {
  for (i in seq(1, iter)) {
    temp <- data.frame(
      Iteracja = c(seq(1, i), seq(1, i)),
      Legenda = c(rep("Średnia", i),rep("Najlepsza", i)),
      WartoscFitness = c(-GAmodel$mean[1:i], -GAmodel$best[1:i])
    );
    pl <- ggplot(
      temp, aes(
        x = Iteracja,
        y = WartoscFitness,
        group = Legenda,
        colour = Legenda
      )
    ) + geom_line() + scale_x_continuous(limits = c(0, iter));
    print(pl);
  }
};
