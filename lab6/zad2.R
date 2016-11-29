iris.original <- read.csv(file = "iris.csv", head = TRUE, sep = ",")

m <- naiveBayes(Species ~ ., data = iris)
ind <- sample(2, nrow(iris), replace = TRUE, prob = c(0.7, 0.3))
iris.training <- iris[ind == 1, 1:5]
iris.test <- iris[ind == 2, 1:5]

iris_training <- naiveBayes(Species ~ ., data = iris.training)
iris_test <- naiveBayes(Species ~ ., data = iris.test)
pred <- predict(iris_training, iris.test[, -5])
table(pred, iris.test[, 5])
