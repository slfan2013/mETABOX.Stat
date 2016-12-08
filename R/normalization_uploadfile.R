#' normalization_uploadfile
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_uploadfile()

normalization_uploadfile <- function(file){
  warningmessage = NULL;
  successmessage = NULL;
  # file = "C:\\Users\\Sili Fan\\Desktop\\WORK\\WCMC\\projects\\mx 255636 Jan Schilling\\mx 255636 Jan Schilling_Project 2_mouse serum_04-2016_submit_4.29.2016.xlsx"
  # file = "C:\\Users\\fansi\\Desktop\\data\\B\\mx 107155 _lung cancer tissue_summer course_08-2015_submit.xlsx"
  # file = "C:\\Users\\Sili Fan\\Desktop\\data\\C\\mx 69088_HepG2 cells_Hirahatake & Meissen_high fructose_summer course_08-2015_submitDATA.xlsx"
  # file = "C:\\Users\\fansi\\Desktop\\data\\D\\mx 149713 + mx 145984_non-obese diabetic mice_summer Course_08-2015_submit.xlsx"

  # file = "C:\\Users\\fansi\\Desktop\\mx 149713 + mx 145984_non-obese diabetic mice_summer Course_08-2015_submit.xlsx"
  d <- openxlsx::read.xlsx(file, sheet = 1,colNames = FALSE)

  #get phenotype
  index = is.na(d[,1]);index[!index][1] = TRUE
  p = d[index,]
  p = p[,!is.na(p[1,])]
  p = p[!is.na(p[,1])]


  if(sum(duplicated(p[[1]]))>0){
    stop("Error: Duplicated '",p[[1]][duplicated(p[[1]])],"' found in phenotype set. ")
  }
  p = p[!duplicated(p[[1]]),]
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
    warningmessage = paste0(warningmessage,
                    "<p class='text-warning'>'ID' not found in phenotype set. This means there is no repeated measure in the data. 'ID' automatically added as 1, 2, 3,...</p>")
    p$ID = 1:nrow(p)
  }

  if(!"phenotypeindex"%in%names(p)){
    warningmessage = paste0(warningmessage,
                            "<p class='text-warning'>'phenotypeindex' not found in phenotype set. 'phenotypeindex' is automatically added as 1, 2, 3,...</p>")

    p = cbind(phenotypeindex = 1:nrow(p),p);
  }

  if(!"featureindex"%in%names(p)){
    warningmessage = paste0(warningmessage,
                            "<p class='text-warning'>'featureindex' not found in feature set. 'featureindex' is automatically added as 1, 2, 3,...</p>")

    f = cbind(featureindex=1:nrow(f),f);
  }
  # check if there is compound with no sd.
  sds = apply(e,1,sd)
  if(sum(sds==0)>0){
    for(i in which(sds==0)){
      e[i,] = rnorm(length(e[i,]))
    }
    warningmessage = paste0(warningmessage,
                            "<p class='text-warning'>BE CAUTIONS: compound # ,",paste(which(sds==0),collapse=",")," is constant! They are replaced with random values for metabox to proceed forward.</p>")
  }

  if(is.null(warningmessage)){
    writeLines("","warning.txt")
  }else{
    writeLines(warningmessage,"warning.txt")
  }

  successmessage = paste0("<p class='text-success'>File, ",substring(file,tail(gregexpr("\\\\",file)[[1]],n=1)+2)," is successfully uploaded!</p>
                          <p class='text-success'>The data file contains ",nrow(p)," samples and ", nrow(f), " compounds.</p>
                          <p class='text-success'>Note: samples are ", ifelse(sum(duplicated(p$ID))==0,"NOT",""), " paired.</p>
                          <p class='text-danger'>A total of ", sum(is.na(e))," (",round(sum(is.na(e))/(nrow(e)*ncol(e))*100,2),"%) missing values (i.e. empty cells in the file) are detected.
                          By default these missing values will be replaced by a small value. Click <strong>Continue</strong> to proceed missing value imputation.</p>")


  writeLines(successmessage,"success.txt")



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
              fileName=file,
              phenotypenames = colnames(p),featurenames = colnames(f),compound_name=compound_name,sample_name=sample_name))
}

