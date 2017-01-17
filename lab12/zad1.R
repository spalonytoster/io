cname <- file.path('./articles')

library(tm)
docs <- Corpus(DirSource(cname))

# preprocessing
docs <- tm_map(docs, removePunctuation)
docs <- tm_map(docs, removeNumbers)
docs <- tm_map(docs, tolower)
docs <- tm_map(docs, removeWords, stopwords("english"))
library(SnowballC)
docs <- tm_map(docs, stemDocument)
docs <- tm_map(docs, stripWhitespace)
docs <- tm_map(docs, PlainTextDocument)

# stage the data
dtm <- DocumentTermMatrix(docs)
tdm <- TermDocumentMatrix(docs)

# explore your data
freq <- colSums(as.matrix(dtm))
length(freq)
ord <- order(freq)
 m <- as.matrix(dtm)
 dim(m)
 write.csv(m, file="DocumentTermMatrix.csv")

# focus
dtms <- removeSparseTerms(dtm, 0.1)

# word frequency
head(table(freq), 20)
tail(table(freq), 20)

freq <- colSums(as.matrix(dtms))
freq

findFreqTerms(dtm, lowfreq=50)

# plot word frequencies
# plot words that appear at least 50x
library(ggplot2)
wf <- data.frame(word=names(freq), freq=freq)
p <- ggplot(subset(wf, freq>50), aes(word, freq))
p <- p + geom_bar(stat="identity")
p <- p + theme(axis.text.x=element_text(angle=45, hjust=1))
p

# relationships between terms
# term correlations
# findAssocs(dtm, c("programming", "computer"), corlimit=0.98) to nie dziala
findAssocs(dtm, c("question"), corlimit=0.98)

# word clouds
library(wordcloud)
dtms <- removeSparseTerms(dtm, 0.15)
freq <- colSums(as.matrix(dtm))
dark2 <- brewer.pal(6, "Dark2")
wordcloud(names(freq), freq, max.words=100, rot.per=0.2, colors=dark2)

# clustering by term similarity
# hierarchal clustering
dtms <- removeSparseTerms(dtm, 0.15)
library(cluster)
d <- dist(t(dtms), method="euclidian")
fit <- hclust(d=d, method="ward")
plot.new()
plot(fit, hang=-1)
groups <- cutree(fit, k=5)
rect.hclust(fit, k=5, border="red")

# k-means
library(fpc)
library(cluster)
dtms <- removeSparseTerms(dtm, 0.15)
d <- dist(t(dtms), method="euclidian")
kfit <- kmeans(d, 2)
clusplot(as.matrix(d), kfit$cluster, color=T, shade=T, labels=2, lines=0)
