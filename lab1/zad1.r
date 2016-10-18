data <- read.csv('./osoby.csv', header = TRUE, sep = ',')
data['imie']
subset(data, plec == 'k')
subset(data, plec == 'm' & wiek > 50)
write.table(data2, file = 'osoby2.csv', row.names = FALSE, na = '', sep = ',', col.names = FALSE, quote = FALSE)
