#' samplesize_visullizeeffectsize
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_visullizeeffectsize()

samplesize_visullizeeffectsize <- function(means=c(-1,0,1),sds=c(1,2,1),pooled_variance = NULL,sigma_mu=NULL,effectsizevalue = NULL){
  globalmean=mean(means)
  data = list()
  for(i in 1:length(means)){
    data[[i]] = qnorm(c(0.05,.25,.5,.75,.95),mean=means[i],sd=sds[i])
  }
  if(!is.null(effectsizevalue)){
    boxplot(data,col=c("light grey", "white"),xlab="group #",ylab="values",frame=F,
            main=paste0("visualize of effect size = ",round(sigma_mu/pooled_variance,2)),
            sub=paste0(length(means)," groups. MEANs = ",paste(means,collapse = ", "),'. SDs = ',paste(sds,collapse = ", "),". Global mean = ",globalmean,"."))
  }else{
    boxplot(data,col=c("light grey", "white"),xlab="group #",ylab="values",frame=F,
            main=paste0("visualize of effect size = ",effectsizevalue),
            sub=paste0(length(means)," groups. MEANs = ",paste(means,collapse = ", "),'. SDs = ',paste(sds,collapse = ", "),". Global mean = ",globalmean,"."))
  }

}


