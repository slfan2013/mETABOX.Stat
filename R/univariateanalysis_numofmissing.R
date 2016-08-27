#' univariateanalysis_numofmissing
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_numofmissing()

univariateanalysis_numofmissing <- function(e,f,p,missindex=NA,compoundName = "Binbase name",tolmissingperc=50){
  library(jsonlite)

  if(is.na(missindex)){
    miss = apply(data.matrix(e),1,function(x){
      sum(is.na(x))
    })
    numofmiss = sum(miss)
  }else if(is.null(missindex)){
    miss = apply(data.matrix(e),1,function(x){
      sum(is.null(x))
    })
    numofmiss = sum(miss)
  }else if(substr(missindex,1,1) == "<"){
    e[is.na(e)] = -1
    miss = apply(data.matrix(e),1,function(x){
      sum(x<as.numeric(substring(missindex, 2)),na.rm = T)
    })
    numofmiss = sum(miss)
  }else{
    miss = apply(data.matrix(e),1,function(x){
      sum(x==missindex)
    })
    numofmiss = sum(miss)
  }
  miss_rate = round(miss/ncol(e)*100,3)
  tolerable = list();
  untolerable = list();
  for(i in 1:nrow(e)){
    if(miss_rate[i]>as.numeric(tolmissingperc)){
      tolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = miss_rate[i]);
      untolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = NULL);
    }else{
      tolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = NULL);
      untolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = miss_rate[i]);
    }
  }


  percofmiss=numofmiss/ncol(e)

  return(list(numofmiss=numofmiss,percofmiss=percofmiss,miss_rate= miss_rate,
              tolerable = toJSON(tolerable,auto_unbox=T),untolerable=toJSON(untolerable,auto_unbox=T)))
}

