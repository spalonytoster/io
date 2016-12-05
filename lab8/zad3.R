library("neuralnet")

normalize <- function(x) {
	return(x-min(x))/(max(x)-min(x));
}

scoreClassificationResult <- function(comparison) {
  rows <- nrow(comparison)
  positive <- 0
  for (i in 1:rows) {
    if (comparison$class[i] == comparison$Predicted[i]) {
      positive <- positive + 1
    }
  }
  return(positive/rows * 100)
}

diabetes <- read.csv(file = "diabetes.csv", head = TRUE, sep = ",")

# normalizacja danych
diabetes.norm <- as.data.frame(lapply(diabetes[1:8], normalize))
diabetes.norm$class <- diabetes$class

# podział na zbior treningowy i testowy
ind <- sample(2, nrow(diabetes.norm), replace = TRUE, prob = c(0.7, 0.3))
diabetes.training <- diabetes[ind == 1, 1:9]
diabetes.test <- diabetes[ind == 2, 1:9]

# rozbicie kolumny species na osobne kolumny dla kazdej klasy w zbiorze treningowym
diabetes.training$positive <- c(diabetes.training$class == "tested_positive")
diabetes.training$negative <- c(diabetes.training$class == "tested_negative")

diabetes.training$class <- NULL

# tworzenie sieci
diabetes.net <- neuralnet(positive + negative ~ pregnant.times + glucose.concentr + blood.pressure + skin.thickness + insulin + mass.index + pedigree.func + age, diabetes.training, hidden=3, lifesign="full")
plot(diabetes.net, rep="best")

predict <- compute(diabetes.net, diabetes[1:8])
result <- 0
nrows <- nrow(diabetes)

for (i in 1:nrows) { result[i] <- which.max(predict$net.result[i,]) }
for (i in 1:nrows) { if (result[i]==1) {result[i] = "tested_positive"} }
for (i in 1:nrows) { if (result[i]==2) {result[i] = "tested_negative"} }

comparison <- diabetes
comparison$Predicted <- result

sprintf('%f%% success rate', scoreClassificationResult(comparison))
# [1] "65.234375% success rate"
