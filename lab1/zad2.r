data[,"wyplata"] <- format(runif(7, 2000, 5000), digits = 6, decimal.mark = '.')
data = rbind(data, data.frame(nazwisko = 'Kowalski', imie = 'Jan', plec = 'm', wiek = '30', wyplata = format(runif(1, 2000, 5000), digits = 6)))
