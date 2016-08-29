#' normalization_dealwithmissing
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_dealwithmissing()

normalization_dealwithmissing <- function(e,f,p,missindex=NA,
                                               removemiss = TRUE,miss_rate ,tolmissingperc=50,
                                               missingreplacemethod = 'half minimum',
                                               missgroup = "organ,treatment"){
  # library(jsonlite)
  rep.row<-function(x,n){
    matrix(rep(x,each=n),nrow=n)
  }
  if(is.na(missindex)){
    e0 = e
  }else if(substr(missindex,1,1) == "<"){
    e[is.na(e)] = -1
    e0 = e
    e0[e0<as.numeric(substring(missindex, 2))] = NA
  }else{
    e0 = e
    e0[e0==missindex] = NA
  }

  if(removemiss){
    f$missingremoved = (miss_rate)>as.numeric(tolmissingperc)
    e0 = e0[!f$missingremoved,]
  }
  if(length(missgroup==0)){
    missgroup = NA
  }else if(missgroup == "no"){
    missgroup = NA
  }
  if(is.null(missgroup)||is.na(missgroup)){
    if(missingreplacemethod == "half minimum"){
      values = apply(e0,1,min,na.rm = T)/2
    }else if(missingreplacemethod == 'minimum'){
      values = apply(e0,1,min,na.rm = T)
    }else if(missingreplacemethod == 'mean'){
      values = apply(e0,1,mean,na.rm = T)
    }else if(missingreplacemethod == 'median'){
      values = apply(e0,1,median,na.rm = T)
    }
    k <- which(is.na(e0), arr.ind=TRUE)
    e0[k] <- values[k[,1]]

  }else{
    te0 = data.frame(index = 1:ncol(e0),t(e0))
    if(missingreplacemethod == "half minimum"){
      values = by(te0,INDICES = p[strsplit(missgroup, ",")[[1]]], FUN = function(x){
        data.frame(x$index, rep.row(apply(x[,-1],2,min,na.rm = T)/2,nrow(x)))
      })
    }else if(missingreplacemethod == 'minimum'){
      values = by(te0,INDICES = p[strsplit(missgroup, ",")[[1]]], FUN = function(x){
        data.frame(x$index, rep.row(apply(x[,-1],2,min,na.rm = T),nrow(x)))
      })
    }else if(missingreplacemethod == 'mean'){
      values = by(te0,INDICES = p[strsplit(missgroup, ",")[[1]]], FUN = function(x){
        data.frame(x$index, rep.row(apply(x[,-1],2,mean,na.rm = T),nrow(x)))
      })
    }else if(missingreplacemethod == 'median'){
      values = by(te0,INDICES = p[strsplit(missgroup, ",")[[1]]], FUN = function(x){
        data.frame(x$index, rep.row(apply(x[,-1],2,median,na.rm = T),nrow(x)))
      })
    }
    valuematrix = do.call('rbind',values)
    valuematrix = valuematrix[order(valuematrix[,1]),][,-1]
    valuematrix = t(valuematrix)
    e0[which(is.na(e0),arr.ind = T)] = valuematrix[which(is.na(e0),arr.ind = T)]
  }






  return(list(e1=e0,f1=f,p1=p))
}

