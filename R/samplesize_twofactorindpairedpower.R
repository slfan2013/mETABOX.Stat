#' samplesize_twofactorindpairedpower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_twofactorindpairedpower()

samplesize_twofactorindpairedpower <- function(k=3,m=3,effectsize=0.8,sig_level = 0.05,power=0.8,corr=0.5,epsilon=0.75,forplot=FALSE,samplerange=NULL,effectsizerange=NULL){
  library(jsonlite)
  if(!forplot){
    df1 = (k-1)*(m - 1)*epsilon
    mu = m/(1-corr)
    p.body = quote({
      ncp = effectsize^2 * mu * N * epsilon
      df2 = (N-k)*(m-1)*epsilon
      pf(qf(sig_level,df1,df2,lower.tail = F),df1,df2,ncp,lower.tail = F)
    })
    return(ceiling(tryCatch(uniroot(function(N) eval(p.body) - power, c(m +
                                                                          1e-10, 1e+05))$root/k,error = function(e){return("NA")})))
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
      df1 = (k-1)*(m - 1)*epsilon
      df2 = (n*k-k)*(m-1)*epsilon
      mu = m/(1-corr)
      ncp = effectsizes[i]^2 * mu * n*k * epsilon
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
