# metabox installation method.

In R, run following code.

```r
if (!require("devtools"))
install.packages('devtools', repos="http://cran.rstudio.com/")
library(devtools)
install_github('slfan2013/metabox.stat',force=TRUE)
library(metabox.stat)
if(!require("opencpu"))
install.packages('opencpu')
library(opencpu)
opencpu$browse('library/metabox.stat/www')
```


# metabox launching method.

In R, run following code.

```r
library(devtools)
library(metabox.stat)
library(opencpu)
opencpu$browse('library/metabox.stat/www')
```
