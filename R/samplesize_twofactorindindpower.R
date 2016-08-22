#' samplesize_twofactorindindpower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_twofactorindindpower()

samplesize_twofactorindindpower <- function(k1=3,k2=3,effectsize=0.8,sig_level = 0.05,power=0.8){
  library(pwr)
  k=k1*k2
  return(ceiling(pwr.anova.test(k = k, f = effectsize, sig.level = sig_level, power = power)$n))
}
