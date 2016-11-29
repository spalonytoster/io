library(class)
library(gmodels)

diabetes.original <- read.csv(file = "diabetes.csv", head = TRUE, sep = ",")

normalize <- function(x) {
    num <- x - min(x)
    denom <- max(x) - min(x)
    return(num/denom)
}

diabetes_norm <- as.data.frame(lapply(diabetes.original[1:8], normalize))

print(summary(diabetes_norm))

set.seed(1234)

ind <- sample(2, nrow(diabetes.original), replace = TRUE, prob = c(0.67, 0.33))

diabetes.training <- diabetes.original[ind == 1, 1:8]
diabetes.test <- diabetes.original[ind == 2, 1:8]

diabetes.trainLabels <- diabetes.original[ind == 1, 9]
diabetes.testLabels <- diabetes.original[ind == 2, 9]

diabetes_pred <- knn(train = diabetes.training, test = diabetes.test, cl = diabetes.trainLabels,
    k = 11)

print("diabetes_pred:")
print(diabetes_pred)

calcScore <- function(test, pred) {
    pm <- data.frame(test, pred)
    wynik <- 0
    for (i in 1:nrow(pm)) {
        if (pm[i, 1] == pm[i, 2])
            wynik <- wynik + 1
    }
    return(paste(wynik/nrow(pm) * 100, "% udało się poprawnie przypasować"))
}

print("calcScore(diabetes.testLabels, diabetes_pred):")
print(calcScore(diabetes.testLabels, diabetes_pred))

CrossTable(x = diabetes.testLabels, y = diabetes_pred, prop.chisq = FALSE)
