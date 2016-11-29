library(editrules)

dirty.iris <- read.csv(file = "dirty_iris.csv", head = TRUE, sep = ",")

dirty.filtered <- subset(dirty.iris, is.finite(dirty.iris$Sepal.Length) & is.finite(dirty.iris$Sepal.Width) &
    is.finite(dirty.iris$Petal.Length) & is.finite(dirty.iris$Petal.Width))

nrow(dirty.filtered)
# [1] 95

ve <- violatedEdits(E, dirty.iris)
summary(ve)
plot(ve)
