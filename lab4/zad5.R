plotIris <- function(SepalLength,SepalWidth,PetalLength,PetalWidth) {
	iris.plot <- log(c(SepalLength,SepalWidth,PetalLength,PetalWidth));
	iris.log <- log(iris.numeric);
	iris.plot <- c((iris.plot[1] - mean(iris.log$sepallength) ) / sd(iris.log$sepallength), (iris.plot[2] - mean(iris.log$sepalwidth)) / sd(iris.log$sepalwidth), (iris.plot[3] - mean(iris.log$petallength)) / sd(iris.log$petallength), (iris.plot[4] - mean(iris.log$petalwidth)) / sd(iris.log$petalwidth));

	iris.plot <- data.frame(sum(iris.plot * iris.pca[2]$rotation[,1]), sum(iris.plot * iris.pca[2]$rotation[,2]));

	plot(subset(iris.pca.data, class == "Iris-setosa")$PC1, subset(iris.pca.data, class == "Iris-setosa")$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="red", pch=21);
	par(new=TRUE);
	plot(subset(iris.pca.data, class == "Iris-versicolor")$PC1, subset(iris.pca.data, class == "Iris-versicolor")$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="green", pch=21);
	par(new=TRUE);
	plot(subset(iris.pca.data, class == "Iris-virginica")$PC1, subset(iris.pca.data, class == "Iris-virginica")$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="blue", pch=21);
	par(new=TRUE);
	plot(iris.plot, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", pch=16,cex=1.5);

	legend("topleft", c("setosa","versicolor","virginica","new"), fill = c("red","green","blue","black"), cex = 0.75);
}
