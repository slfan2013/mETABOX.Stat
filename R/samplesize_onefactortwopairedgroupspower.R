#' samplesize_onefactortwopairedgroupspower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_onefactortwopairedgroupspower()

samplesize_onefactortwopairedgroupspower <- function(effectsize=0.8,sig_level = 0.05,power=0.8,forplot=FALSE,samplerange=NULL,effectsizerange=NULL){
  library(jsonlite)
  if(!forplot){
    return(ceiling(power.t.test(delta = effectsize,power = power, sig.level = sig_level,type="paired",alternative="two.sided")$n))
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
      df = n-1
      ncp = abs(effectsizes[i]*sqrt(n))
      power = pt(qt(p=sig_level/2,df=df,lower.tail = F),df,ncp,lower.tail = F)
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
    return(toJSON(data,auto_unbox=T))
  }

}
