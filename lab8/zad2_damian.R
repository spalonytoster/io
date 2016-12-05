install.packages("class")
install.packages("neuralnet")
install.packages("scales")
library("class")
library("neuralnet")
library("scales")

normalize <- function(x) {
	num <- x - min(x)
	denom <- max(x) - min(x)

	return (num/denom)
}

precision <- function(test, pred){
    tab <- data.frame(test,pred)
	wynik<-0
	for(i in 1:nrow(tab)){
                row<-0
		wart_log<-0
		if(tab[i,1]==tab[i,2]){
			wynik<-wynik+1
		}

	}
	return(percent(wynik/nrow(tab)))
}

classification <- function(predict){
	result <- 0
	for (i in 1:nrow(predict$net))
	{
		result[i] <- which.max(predict$net.result[i,])
		if (result[i]==1)
		{
			result[i] = "Iris-setosa"
		}
		else if (result[i]==2)
		{
			result[i] = "Iris-versicolor"
		}
		else if (result[i]==3)
		{
			result[i] = "Iris-virginica"
		}
	}
	return(result)
}

iris <- read.csv(file="iris.csv", head=TRUE)

iris_norm <- as.data.frame(lapply(iris[1:4], normalize))
iris_norm <- data.frame(iris_norm,iris[5])
set.seed(1234)

ind <- sample(2, nrow(iris_norm), replace=TRUE, prob=c(0.7, 0.3))

iris.training <- iris_norm[ind==1, 1:5]

iris.training$setosa <- c(iris.training$class == "Iris-setosa")
iris.training$versicolor <- c(iris.training$class == "Iris-versicolor")
iris.training$virginica <- c(iris.training$class == "Iris-virginica")

iris.training$class <- NULL

inet <- neuralnet(setosa + versicolor + virginica ~ sepallength + sepalwidth + petallength + petalwidth, iris.training, hidden=3, lifesign="full")
plot(inet, rep="best")

#network without additional nodes
plot(inet, rep="best", intercept=FALSE)

predict <- compute(inet, iris_norm[1:4])

result <- classification(predict)

irisOriginal <- iris[5]

precision(result, irisOriginal)
