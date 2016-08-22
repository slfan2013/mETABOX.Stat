#' samplesize_onefactortwopairedgroupspower
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' samplesize_onefactortwopairedgroupspower()

samplesize_onefactortwopairedgroupspower <- function(effectsize=0.8,sig_level = 0.05,power=0.8){
  return(ceiling(power.t.test(delta = effectsize,power = power, sig.level = sig_level,type="paired")$n))
}
