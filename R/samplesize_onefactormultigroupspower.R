#' samplesize_onefactormultigroupspower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_onefactormultigroupspower()

samplesize_onefactormultigroupspower <- function(k = 3,effectsize=0.8,sig_level = 0.05,power=0.8){
  library(pwr)
  return(ceiling(pwr.anova.test(k = k, f = effectsize, sig.level = sig_level, power = power)$n))
}
