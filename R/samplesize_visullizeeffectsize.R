#' samplesize_visullizeeffectsize
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_visullizeeffectsize()

samplesize_visullizeeffectsize <- function(means=c(-1,0,1),sds=c(1,2,1),corr = 0.5, effectsizevalue = NULL,
                                           type = "two independent groups"){
  library(MASS)
  globalmean=mean(means)
  data = list()
  if(type == "two independent groups" |type == "multiple independent groups"){
    for(i in 1:length(means)){
      data[[i]] = qnorm(c(0.05,.25,.5,.75,.95),mean=means[i],sd=sds[i])
    }
    boxplot(data,col=c("light grey", "white"),xlab="group #",ylab="values",frame=F,
            main=paste0("visualize of effect size = ",round(effectsizevalue,4)),
            sub=paste0(length(means)," groups. MEANs = ",paste(means,collapse = ", "),'. SDs = ',paste(sds,collapse = ", "),". Global mean = ",round(globalmean,4),"."))

  }else if(type == "two paired groups" | type=="multiple paired groups"){
      Sigma = diag(x = sds)
      Sigma[Sigma==0] = corr
      data = mvrnorm(n = 100, mu = means, Sigma = Sigma, tol = 1e-6, empirical = FALSE, EISPACK = FALSE)
      boxplot(data,col=c("light grey", "white"),xlab="group #",ylab="values",frame=F,
              main=paste0("visualize of effect size = ",round(effectsizevalue,4)),
              sub=paste0(length(means)," groups. MEANs = ",paste(means,collapse = ", "),'. SDs = ',paste(sds,collapse = ", "),". Global mean = ",round(globalmean,4),". Corr = ",corr,"."))
      for(i in 1:nrow(data)){
        lines(data[i,],col='grey')
      }
  }

}


