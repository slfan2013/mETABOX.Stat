

# metabox installation method.

In R, run following code.

```r
if (!require("devtools"))
install.packages('devtools', repos="http://cran.rstudio.com/")
library(devtools)
install_github('slfan2013/metabox.stat',force=TRUE)
install_github('barupal/metamapp',force=TRUE)
library(metabox.stat)
library(MetaMapp2016)
if(!require("opencpu"))
install.packages('opencpu')
library(opencpu)
opencpu$browse('library/metabox.stat/www')
opencpu$browse('library/MetaMapp2016/www')
```

(to change the lib directory" https://stackoverflow.com/questions/2615128/where-does-r-store-packages)
# metabox launching method.

In R, run following code.

```r
library(devtools)
library(metabox.stat)
library(opencpu)
opencpu$browse('library/metabox.stat/www')
opencpu$browse('library/MetaMapp2016/www')
```
