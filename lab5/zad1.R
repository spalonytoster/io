library(class)
library(gmodels)

read.csv(url("http://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"),
    header = FALSE)

iris.original <- read.csv(file = "iris.csv", head = TRUE, sep = ",")

normalize <- function(x) {
    num <- x - min(x)
    denom <- max(x) - min(x)
    return(num/denom)
}

iris_norm <- as.data.frame(lapply(iris[1:4], normalize))

print(summary(iris_norm))

set.seed(1234)

ind <- sample(2, nrow(iris), replace = TRUE, prob = c(0.67, 0.33))

iris.training <- iris[ind == 1, 1:4]
iris.test <- iris[ind == 2, 1:4]

iris.trainLabels <- iris[ind == 1, 5]
iris.testLabels <- iris[ind == 2, 5]

iris_pred <- knn(train = iris.training, test = iris.test, cl = iris.trainLabels,
    k = 3)

print("iris.pred:")
print(iris_pred)

calcScore <- function(test, pred) {
    pm <- data.frame(test, pred)
    wynik <- 0
    for (i in 1:nrow(pm)) {
        if (pm[i, 1] == pm[i, 2])
            wynik <- wynik + 1
    }
    return(paste(wynik/nrow(pm) * 100, "% udało się poprawnie przypasować"))
}

print("calcScore(iris.testLabels, iris_pred):")
print(calcScore(iris.testLabels, iris_pred))

CrossTable(x = iris.testLabels, y = iris_pred, prop.chisq = FALSE)
