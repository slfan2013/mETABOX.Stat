#'univariateanalysis_gg_color_hue
#'@description univariateanalysis_gg_color_hue
#'
#'@usage
#'@param n number of colors.

#'@details
#'
#'@return
#'@author Sili Fan \email{fansili2013@gmail.com}
#'@seealso
#'@examples
#'@export
#'
univariateanalysis_gg_color_hue <- function(n) {
  hues = seq(15, 375, length = n + 1)
  hcl(h = hues, l = 65, c = 100)[1:n]
}
