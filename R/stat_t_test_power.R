#' t test power
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' cat_function()

stat_t_test_power <- function(effectsize,n1,n2 = n1,sig_level = 0.05){
  df = n1+n2-2

  result = sapply(n1,function(x){
    ncp = effectsize*sqrt(n1*n2/(n1+n2))
    return(pt(qt(sig_level,df,lower.tail = F),df,ncp,lower.tail = F))
  })

  return(result)
}
