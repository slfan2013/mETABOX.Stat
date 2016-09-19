#' normalization_numofmissing
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_numofmissing()

normalization_numofmissing <- function(e,f,p,missindex=NA,compoundName = "Binbase name",tolmissingperc=50){
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
      x[is.na(x)] = missindex
      sum(x==missindex)
    })
    numofmiss = sum(miss)
  }
  miss_rate = round(miss/ncol(e)*100,3)


  tolerable = list();# all compounds
  untolerable = list();# all compounds
  missing = list();
  for(i in 1:nrow(e)){
    if(miss_rate[i]>as.numeric(tolmissingperc)){
      tolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = miss_rate[i]);
      untolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = NULL);
      missing[[i]] = list(y=miss_rate[i],label=f[[compoundName]][i]);
    }else if(miss_rate[i]>0){
      tolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = NULL);
      untolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = miss_rate[i]);
      missing[[i]] = list(y=miss_rate[i],label= f[[compoundName]][i]);
    }else{
      tolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = NULL);
      untolerable[[i]] = list(x = i, label = f[[compoundName]][i], y = miss_rate[i]);
    }
  }
  percofmiss=numofmiss/ncol(e)

  missing = missing[!sapply(missing,is.null)]

  if(!length(missing)==0){#if missing == 0; then sort. Else dont sort and return list().
    missing = missing[order(as.numeric(unlist(missing)[seq(1,length(unlist(missing)),by=2)]))]
  }



  return(list(numofmiss=numofmiss,percofmiss=percofmiss,miss_rate= miss_rate,
              tolerable = toJSON(tolerable,auto_unbox=T),untolerable=toJSON(untolerable,auto_unbox=T),
              missing = toJSON(missing,auto_unbox = T)))
}

