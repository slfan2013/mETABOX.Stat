#' normalization_uploadfile
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_uploadfile()

normalization_uploadfile <- function(file){
  message = NULL
  # file = "C:\\Users\\Sili Fan\\Desktop\\Sili's data\\A\\mx 131933_tomatillo vs pumpkin_summer course_08-2015_submit.xlsx"
  # file = "C:\\Users\\fansi\\Desktop\\mx_274941_Francisco Portell_human cells_06-2016_submit.xlsx"
  d <- openxlsx::read.xlsx(file, sheet = 1,colNames = FALSE)

  #get phenotype
  index = is.na(d[,1]);index[!index][1] = TRUE
  p = d[index,]
  p = p[,!is.na(p[1,])]
  p = p[!is.na(p[,1])]


  if(sum(duplicated(p[[1]]))>0){
    message = paste0("Warning: Duplicated '",p[[1]][duplicated(p[[1]])],"' found in phenotype set. The first '",p[[1]][duplicated(p[[1]])],
                    "' is kept and others are removed.")
  }
  p = p[!duplicated(p[[1]])]
  colnames_p = p[[1]]
  p= t(p)
  colnames(p) = colnames_p
  p = data.frame(p[-1,],check.names = FALSE,stringsAsFactors = FALSE)
  p = p[,sapply(p,function(x){sum(!is.na(x))})!=0]

  #get feature
  f = d[!is.na(d[,1]),]
  index = is.na(d[1,]);index[!index][1] = TRUE
  f = f[,index]
  colnames(f) = as.character(f[1,])
  f = f[-1,]
  f=f[,sapply(f,function(x){sum(!is.na(x))})!=0]

  #get expression
  e = d[-c(1:(length(p)+1)),]
  e = e[,-c(1:length(f))]
  # e = e[,sapply(e,function(x){sum(!is.na(x))})!=0]
  # e = e[apply(e,1,FUN=function(x){sum(!is.na(x))})!=0,]
  e = e[1:nrow(f),1:nrow(p)]
  e = sapply(e, as.numeric)



  #warning when data doesn't have ID.
  if(!"ID"%in%names(p)){
    message = paste0(message,"\n",
                    "'ID' not found in phenotype set. This means there is no repeated measure in the data. 'ID' automatically added.")
    p$ID = 1:nrow(p)
  }

  writeLines(message,"warning.txt")
  writeLines("Data is successfully uploaded!","success.txt")

  p = cbind(phenotypeindex = 1:nrow(p),p);
  f = cbind(featureindex=1:nrow(f),f);

  if("compound_name" %in% colnames(f)){#compound name is required for missing value plot.
    compound_name = "compound_name";
  }else{
    compound_name = FALSE;
  }

  if("sample_name" %in% colnames(p)){#compound name is required for missing value plot.
    sample_name = "sample_name";
  }else{
    sample_name = FALSE;
  }
  return(list(expression = e, phenotype = p, feature = f,
              phenotypenames = colnames(p),featurenames = colnames(f),compound_name=compound_name,sample_name=sample_name))
}

