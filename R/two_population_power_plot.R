#' two_population_power_plot
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' two_population_power_plot()

two_population_power_plot <- function(effectsize=0.8,n=seq(2,100,by=2),sig_level=0.05){

  library(jsonlite)
  if(!is.na(as.numeric(effectsize))){
    effectsize = as.numeric(effectsize)
    effectsizes = c(effectsize-0.1,effectsize,effectsize+0.1)
  }else{
    effectsizes = as.numeric(strsplit(effectsize, ";")[[1]])
  }

  data = list()
  for(i in 1:length(effectsizes)){
    data[[i]] = list(
      x=n,
      y=power.t.test(delta = effectsizes[[i]],n = n, sig.level = sig_level)$power,
      mode="lines+markers",
      name=paste0("Effect Size at: ", effectsizes[[i]])
    )
  }

  return(toJSON(data,auto_unbox=T))
}

