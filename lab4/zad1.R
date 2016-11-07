library(caret);

# iris.orginal <- read.csv("iris.csv", head = TRUE)

correlation1 <- cor(x = iris$Sepal.Length, y=iris$Sepal.Width);
correlation2 <- cor(x = iris$Sepal.Length, y=iris$Petal.Length);
correlation3 <- cor(x = iris$Sepal.Length, y=iris$Petal.Width);
correlation4 <- cor(x = iris$Sepal.Width, y=iris$Petal.Length);
correlation5 <- cor(x = iris$Sepal.Width, y=iris$Petal.Width);
correlation6 <- cor(x = iris$Petal.Length, y=iris$Petal.Width);

iris.numeric <- iris[, 1:4]
iris.preproc <- scale(log(iris.numeric))

iris.pca <- prcomp(iris.numeric)
