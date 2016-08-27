#' univariateanalysis_uploadfile
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_uploadfile()

univariateanalysis_uploadfile <- function(file){
  # file = "C:\\Users\\Sili Fan\\Desktop\\Sili's data\\A\\mx 131933_tomatillo vs pumpkin_summer course_08-2015_submit.xlsx"
  library(data.table)
  library(openxlsx)
  library(reshape2)

  if(grepl("xlsx", file)){
    d <- read.xlsx(file, sheet = 1,colNames = FALSE)
  }
  d=data.table(d)



  #get phenotype
  index = is.na(d[[1]]);index[!index][1] = TRUE
  p = d[index]
  p = p[,!is.na(p[1,]),with=FALSE]
  p = p[!is.na(p[[1]])]
  if(sum(duplicated(p[[1]]))>0){
    message = paste0("Warning: Duplicated '",p[[1]][duplicated(p[[1]])],"' found in phenotype set. The first '",p[[1]][duplicated(p[[1]])],
                    "' is kept and others are removed.")
  }
  p = p[!duplicated(p[[1]])]
  colnames_p = p[[1]]
  x = melt(p, id.vars = 1)
  p = dcast.data.table(x, as.formula(paste0("variable ~ ",colnames(x)[1])))[,-1,with=F]
  setcolorder(p, colnames_p)
  p = p[,sapply(p,function(x){sum(!is.na(x))})!=0,with=FALSE]

  #get feature
  f = d[!is.na(X1)]
  index = is.na(d[1,]);index[!index][1] = TRUE
  f = f[,index,with=FALSE]
  colnames(f) = as.character(f[1,])
  f = f[-1,]
  f=f[,sapply(f,function(x){sum(!is.na(x))})!=0,with=FALSE]

  #get expression
  e = d[-c(1:(length(p)+1))]
  e = e[,-c(1:length(f)),with=F]
  e = e[,sapply(e,function(x){sum(!is.na(x))})!=0,with=FALSE]
  e = e[apply(e,1,FUN=function(x){sum(!is.na(x))})!=0]
  e = e[1:nrow(f),1:nrow(p),with=FALSE]

  #warning when data doesn't have ID.
  if(!"ID"%in%names(p)){
    message = paste0(message,"\n",
                    "'ID' not found in phenotype set. This means there is no repeated measure in the data. 'ID' automatically added.")
  }
  # e$sudo = 1:nrow(e)
  # te= dcast.data.table(melt(e,id.vars = "sudo"), variable ~ sudo)
  # e[,sudo:=NULL]
  writeLines(message,"warning.txt")
  writeLines("Data is successfully uploaded!","success.txt")
  return(list(expression = e, phenotype = p, feature = f))
}

