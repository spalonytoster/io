library(data.table)

tabela <- data.table(X = numeric(), Y = numeric())
tabela <- rbind(tabela, data.table(X = 1, Y = 3))
tabela <- rbind(tabela, data.table(X = 2, Y = 5))
tabela <- rbind(tabela, data.table(X = 3, Y = 2))
tabela <- rbind(tabela, data.table(X = 5, Y = 2))
tabela <- rbind(tabela, data.table(X = 5, Y = 6))
tabela <- rbind(tabela, data.table(X = 7, Y = 4))
tabela <- rbind(tabela, data.table(X = 9, Y = 5))

tabela.kmeans <- kmeans(tabela, centers = 2, iter.max = 10, nstart = 2,
  algorithm = c("Hartigan-Wong", "Lloyd", "Forgy", "MacQueen"))

plot(tabela, col=tabela.kmeans$cluster)
