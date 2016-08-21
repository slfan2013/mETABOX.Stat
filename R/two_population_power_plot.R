#' two_population_power_plot
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' cat_function()

two_population_power_plot <- function(effectsize,n1,n2 = n1,sig_level = 0.05){
  df = n1+n2-2

  result = sapply(n1,function(x){
    ncp = effectsize*sqrt(n1*n2/(n1+n2))
    return(pt(qt(sig_level,df,lower.tail = F),df,ncp,lower.tail = F))
  })

  return(result)
}
