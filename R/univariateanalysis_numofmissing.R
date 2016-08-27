#' univariateanalysis_numofmissing
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_numofmissing()

univariateanalysis_numofmissing <- function(e,f,p,missindex=NA){
  if(is.na(missindex)){
    numofmiss = sum(apply(data.matrix(e),1,function(x){
      sum(is.na(x))
    }))
    return(list(numofmiss=numofmiss,percofmiss=numofmiss/nrow(e)))
  }else if(is.null(missindex)){
    numofmiss = sum(apply(data.matrix(e),1,function(x){
      sum(is.null(x))
    }))
    return(list(numofmiss=numofmiss,percofmiss=numofmiss/nrow(e)))
  }else if(substr(missindex,1,1) == "<"){
    numofmiss = sum(apply(data.matrix(e),1,function(x){
      sum(x<as.numeric(substring(missindex, 2)))
    }))
    return(list(numofmiss=numofmiss,percofmiss=numofmiss/nrow(e)))
  }else{
    numofmiss = sum(apply(data.matrix(e),1,function(x){
      sum(x==missindex)
    }))
    return(list(numofmiss=numofmiss,percofmiss=numofmiss/nrow(e)))
  }

}

