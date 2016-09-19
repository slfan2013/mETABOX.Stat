#' univariateanalysis_summarizegroup
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_summarizegroup()

univariateanalysis_summarizegroup <- function(e2,f2,p2,
                                              group1 = "species",
                                              group2  = "treatment",
                                              test = 'two independent groups'
){

  if(length(group2)==0||test%in%c("two independent groups","two paired groups","multiple independent groups","multiple paired groups")){
    group2 = NULL
  }
  result = tryCatch(addmargins(table(p2[,c(group1,group2)])),
           error = function(err){
             err
           })
  return(result)
}

