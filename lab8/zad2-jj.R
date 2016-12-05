# przyklady do wykladu 2  z sieci neuronowych
####################
# przyklad 1
# zastosowanie pakietu neuralnet
library(neuralnet)
#przyklad uzycia sieci neuronowej do klasyfikacji zbioru iris
#uczy sie na zbiorze 50 elementowym
itrain <- iris[sample(1:150, 50),]
# tworzymy nowe kolumny
itrain$setosa <- c(itrain$Species == "setosa")
itrain$versicolor <- c(itrain$Species == "versicolor")
itrain$virginica <- c(itrain$Species == "virginica")
#sprawdzenie
itrain
itrain$Species <- NULL
#usuwamy niepotrzebne
# uczenie sieci
inet <- neuralnet(setosa + versicolor + virginica ~ Sepal.Length + Sepal.Width + Petal.Length + Petal.Width, itrain, hidden=3, lifesign="full")
#rysunek
plot(inet, rep="best")
predict <- compute(inet, iris[1:4])
result<-0
for (i in 1:150) { result[i] <- which.max(predict$net.result[i,]) }
for (i in 1:150) { if (result[i]==1) {result[i] = "setosa"} }
for (i in 1:150) { if (result[i]==2) {result[i] = "versicolor"} }
for (i in 1:150) { if (result[i]==3) {result[i] = "virginica"} }
#testowanie
comparison <- iris
comparison$Predicted <- result
# ostatnie dwie kolumny powinny byc rowne
comparison
###########################################
#przyklad 2
# klasyfikacja zbioru iris przy pomocy sieci RBF
library(RSNNS)
data(iris)
#shuffle the vector
iris <- iris[sample(1:nrow(iris),length(1:nrow(iris))),1:ncol(iris)]
# dane wjsciowe
irisValues <- iris[,1:4]
#dane wyjsciowe
irisTargets <- decodeClassLabels(iris[,5])
# podzial na dane treningowe i testowe
iris <- splitForTrainingAndTest(irisValues, irisTargets, ratio=0.20)
#normalizacja danych
iris <- normTrainingAndTestSet(iris)
# tworzenie sieci RBFN Radial Basis Function Network
model <- rbf(iris$inputsTrain, iris$targetsTrain, size=5, maxit=20, initFuncParams=c(-4, 4,  0.0,  0.2,  0.04), learnFuncParams=c(1e-3, 0, 1e-3, 0.1, 0.8), linOut=FALSE)
# wydruk wag
weightMatrix(model)
# wydruki w oknie graficznym wymiaru 2 wiersze, 2 kolumny
par(mfrow=c(2,2))
#wydruk bledu
plotIterativeError(model)
# klasyfikacja danych testowych
predictions <- predict(model,iris$inputsTest)
plotRegressionError(predictions[,2], iris$targetsTest[,2])
#macierz bledu
confusionMatrix(iris$targetsTest,predictions)
plotROC(predictions[,2], iris$targetsTest[,2])
