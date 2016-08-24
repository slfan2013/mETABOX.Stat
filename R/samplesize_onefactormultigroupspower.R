#' samplesize_onefactormultigroupspower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_onefactormultigroupspower()

samplesize_onefactormultigroupspower <- function(k = 3,effectsize=0.8,sig_level = 0.05,power=0.8,forplot=FALSE,samplerange=NULL,effectsizerange=NULL){
  library(pwr);library(jsonlite)
  if(!forplot){
    return(tryCatch(ceiling(pwr.anova.test(k = k, f = effectsize, sig.level = sig_level, power = power)$n),error=function(e){
      "Error: Effect Size too BIG. In this case, 2 samples for each group is enough."
    }))
  }else{
    if(is.null(effectsizerange)){
      effectsizes = c(0.2,0.5,0.8)
    }else{
      effectsizes = as.numeric(strsplit(effectsizerange, ",")[[1]])
    }
    if(is.null(samplerange)){
      n = seq(5,100,by=5)
    }else{
      forn = as.numeric(unlist(strsplit(strsplit(samplerange, ",")[[1]],"-")))
      n=seq(forn[1],forn[2],by=forn[3])
    }
    data = list()

    for(i in 1:length(effectsizes)){
      df1 = k-1
      df2 = k*n-k
      ncp = effectsizes[i]^2 * k*n
      power = pf(qf(sig_level,df1,df2,lower.tail = F),df1,df2,ncp,lower.tail = F)
      dP = list()
      for(j in 1:length(power)){
        dP[[j]] = list(label=n[j],y=power[j])
      }
      data[[i]] = list(
        type='spline',
        name =  paste0("ES: ",effectsizes[i]),
        showInLegend = TRUE,
        dataPoints =  dP
      )
    }

    # ceiling(power.t.test(delta = effectsize,power = power, sig.level = sig_level)$n)
    return(toJSON(data,auto_unbox=T))
  }

}
