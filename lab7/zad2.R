library(deducorrect)

dirty.iris <- read.csv("dirty_iris.csv", header=TRUE, sep=",")

R <- correctionRules("edits2.txt")

cor <- correctWithRules(R, dirty.iris)

print(cor$corrected)
