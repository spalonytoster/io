iris.numeric <- iris[, 1:4];
iris.preproc <- scale(log(iris.numeric));
iris.pca <- prcomp(iris.preproc, retx=TRUE, center=TRUE, scale=TRUE);
iris.pca.data <- predict(iris.pca)

table <- data.frame(iris.pca.data[,1:2],iris[5])
iris.pca12 <- data.frame(iris.pca.data[,1:2])
iris.kmeans <- kmeans(iris.pca12, 3)
original <- iris[5]

table(iris$Species, iris.kmeans$cluster)

plot(iris.pca12, col = iris.kmeans$cluster)
points(iris.kmeans$centers, col = 1:3, pch = 8, cex = 2)
