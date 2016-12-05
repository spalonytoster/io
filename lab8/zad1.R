siatk.dane <- read.csv(file = "siatkowka.csv", head = TRUE, sep = ",")

siatk.nn <- neuralnet(gra ~ wiek + waga + wzrost, siatk.dane, hidden = 2, lifesign = "full")
plot(siatk.nn)

siatk.predict <- compute(siatk.nn, siatk.dane[1:3])


activationFunction <- function(x) {
  return(1/(1+exp(-x)))
}

siatk.fun <- function(wiek, waga, wzrost) {
  X1 <- (wiek * -0.461220) + (waga * 0.97314) + (wzrost * -0.39203) + 0.80109
  X2 <- (wiek * 0.78548) + (waga * 2.10584) + (wzrost * -0.57847) + 0.43529

  result <- (activationFunction(X1) * -0.81546) + (activationFunction(X2) + 1.03775) + -0.2368

  return(result)
}
