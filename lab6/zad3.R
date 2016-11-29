library(e1071)
library(party)

ind <- sample(2, nrow(iris), replace = TRUE, prob = c(0.7, 0.3))

iris.training <- iris[ind == 1, 1:4]
iris.test <- iris[ind == 2, 1:4]

iris.trainLabels <- iris[ind == 1, 5]
iris.testLabels <- iris[ind == 2, 5]

iris <- read.csv(file = "iris.csv", head = TRUE, sep = ",")

str(iris)

iris_ctree <- ctree(iris.trainLabels ~ sepallength + sepalwidth + petallength + petalwidth,
    data = iris.training)

print(iris_ctree)
# plot(iris_ctree)
plot(iris_ctree, type = "simple")

print(table(predict(iris_ctree, iris.test), iris.testLabels))
