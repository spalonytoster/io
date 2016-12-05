library("neuralnet")

normalize <- function(x) {
	return(x-min(x))/(max(x)-min(x));
}

scoreClassificationResult <- function(comparison) {
  rows <- nrow(comparison)
  positive <- 0
  for (i in 1:rows) {
    if (comparison$Species[i] == comparison$Predicted[i]) {
      positive <- positive + 1
    }
  }
  return(positive/rows * 100)
}

# normalizacja danych
iris.norm <- as.data.frame(lapply(iris[1:4], normalize))
iris.norm$Species <- iris$Species

# podział na zbior treningowy i testowy
ind <- sample(2, nrow(iris.norm), replace = TRUE, prob = c(0.7, 0.3))
iris.training <- iris[ind == 1, 1:5]
iris.test <- iris[ind == 2, 1:5]

# rozbicie kolumny species na osobne kolumny dla kazdej klasy w zbiorze treningowym
iris.training$setosa <- c(iris.training$Species == "setosa")
iris.training$versicolor <- c(iris.training$Species == "versicolor")
iris.training$virginica <- c(iris.training$Species == "virginica")

iris.training$Species <- NULL

# tworzenie sieci
iris.net <- neuralnet(setosa + versicolor + virginica ~ Sepal.Length + Sepal.Width + Petal.Length + Petal.Width, iris.training, hidden=3, lifesign="full")
plot(iris.net, rep="best")

predict <- compute(iris.net, iris[1:4])
result <- 0

for (i in 1:150) { result[i] <- which.max(predict$net.result[i,]) }
for (i in 1:150) { if (result[i]==1) {result[i] = "setosa"} }
for (i in 1:150) { if (result[i]==2) {result[i] = "versicolor"} }
for (i in 1:150) { if (result[i]==3) {result[i] = "virginica"} }

comparison <- iris
comparison$Predicted <- result

sprintf('%f%% success rate', scoreClassificationResult(comparison))
# [1] "98.000000% success rate"
