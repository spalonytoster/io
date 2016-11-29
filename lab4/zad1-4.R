iris.original <- read.csv('./iris.csv', header=TRUE);

# 1.

corr1 <- cor(x=iris.original$sepallength, y=iris.original$sepalwidth);
corr2 <- cor(x=iris.original$sepalwidth,  y=iris.original$petallength);
corr3 <- cor(x=iris.original$petallength, y=iris.original$petalwidth); # 0.96
corr4 <- cor(x=iris.original$sepallength, y=iris.original$petallength); # 0.87
corr5 <- cor(x=iris.original$sepalwidth,  y=iris.original$petalwidth);
corr6 <- cor(x=iris.original$sepallength, y=iris.original$petalwidth); # 0.81

# 3,4 i 6 są mocno skorelowane dodatnio
# pozostałe nie są lub są słabo skorelowane ujemnie

# 2.

iris.numeric <- iris.original[, 1:4];
iris.preproc <- scale(log(iris.numeric));

# > mean(scale(iris.numeric)[,1])
# [1] -4.484318e-16
# dlaczego?

# 3.
# pca - principal component analysis (analiza głównych składowych)
# a)
iris.pca <- prcomp(iris.preproc, retx=TRUE, center=TRUE, scale=TRUE);

# b)
iris.pca[1];
# Standard deviations:
# [1] 2.0554417 0.4921825 0.2802212 0.1538929

iris.pca[2];
#                     PC1         PC2         PC3        PC4
# sepallength  0.36158968 -0.65653988  0.58099728  0.3172545
# sepalwidth  -0.08226889 -0.72971237 -0.59641809 -0.3240944
# petallength  0.85657211  0.17576740 -0.07252408 -0.4797190
# petalwidth   0.35884393  0.07470647 -0.54906091  0.7511206

# c)
predict(iris.pca);
# -2.399324

sum(iris.preproc[1, ]*iris.pca[2]$rotation[,1]);
# -2.399324

# d)
cor(iris.pca$rotation[,1:2]);

# e)
iris.pca.data <- data.frame(predict(iris.pca)[,c(1:2)], iris.original[5]);

# 4.
plot(subset(iris.pca.data, class == "Iris-setosa")$PC1, subset(iris.pca.data, class == "Iris-setosa")$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="red", pch=21);
par(new=TRUE);
plot(subset(iris.pca.data, class == "Iris-versicolor")$PC1, subset(iris.pca.data, class == "Iris-versicolor")$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="green", pch=21);
par(new=TRUE);
plot(iris.pca.data[which(iris.pca.data$class == "Iris-virginica") , ]$PC1, iris.pca.data[which(iris.pca.data$class == "Iris-virginica") , ]$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5), col="black", bg="blue", pch=21);

#plot(iris.pca.data$PC1, iris.pca.data$PC2, xlab = "PC1", ylab = "PC2", xlim=c(-3.5,2.5), ylim=c(-2.5,3.5))

legend("topleft", c("setosa","versicolor","virginica"), fill = rainbow(3), cex = 0.75);
