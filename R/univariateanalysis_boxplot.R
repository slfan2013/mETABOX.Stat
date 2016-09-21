#" univariateanalysis_boxplot
#"
#" stat
#" @param e2 = twowayIndependentGroups[[1]];f2=twowayIndependentGroups[[2]];p2=twowayIndependentGroups[[3]];
#" @keywords
#" @export
#" @examples
#" univariateanalysis_boxplot()

univariateanalysis_boxplot <- function(e2,f2,p2,
                                       test = "independent*independent",
                                       group1 = "treatment", group2 = 'species',
                                       factor_order1 = NULL, factor_order2 = NULL,
                                       color_group = group1,
                                       main  = "Binbase name", col_main = "black",
                                       ylab = "value", xlab = NULL, col_lab = "black",
                                       xlab_size = 1,legend_position = 'topright',rotation_x = 0,
                                       title_column = "BinBase name",

                                       # test = "independent*independent";
                                       # group1 = 'species'; group2 = 'treatment';
                                       # factor_order1 = NULL; factor_order2 = NULL;
                                       # color_group = group1;
                                       # main  = "Binbase name"; col_main = "black";
                                       # ylab = "value"; xlab = NULL; col_lab = "black";
                                       # xlab_size = 1;legend_position = 'topright';rotation_x = 0

                                       draw_single = FALSE,compoundName = 'z C30 FAME internal standard',sub
                                       ){


  if(is.null(xlab)||is.na(xlab)){
    if(grepl("\\*",test)){
      xlab = paste0(group1, "*", group2)
    }else{
      xlab = group1
    }
  }


  if(grepl("\\*",test)){
    if(is.null(factor_order1)||is.na(factor_order1)){
      factor_order1 = unique(p2[[group1]])
    }else{
      factor_order1 = strsplit(factor_order1, ",")[[1]]
    }
    if(is.null(factor_order2)||is.na(factor_order2)){
      factor_order2 = unique(p2[[group2]])
    }else{
      factor_order2 = strsplit(factor_order2, ",")[[1]]
    }
    tot.n = length(factor_order1)*length(factor_order2)
    m=1
    at.x = vector()
    for(i in 1:(tot.n+length(factor_order2))){
      if(!(i%%(length(factor_order1)+1)==0)){
        at.x[m] = m
      }
      m=m+1
    }
    at.x = at.x[!is.na(at.x)]
    text.pos.x = seq((tot.n/length(factor_order2)+1)/2,tot.n,by = tot.n/length(factor_order2))
    text.pos.x = text.pos.x + 0:(length(text.pos.x)-1)

    if(draw_single){
      index=which(gsub(" ", "", f2[[main]], fixed = TRUE)==gsub(" ", "", compoundName, fixed = TRUE))
      oo = index
    }else{
      index=1:nrow(f2)
      oo=1
    }

    for(j in index){
      if(f2$missingremoved[j]){

      }else{
        data = data.frame(value = e2[oo,],group1 = factor(p2[[group1]],levels = factor_order1), group2 = factor(p2[[group2]],levels = factor_order2))
        if(!draw_single){
          png(paste0(j,'th_',f2[j,"Binbase name"],'.png'), width = 800, height = 600)
        }
        boxplot(value~group1*group2,data = data,notch=FALSE,col=terrain.colors(length(factor_order1)),
                xaxt="n",at = at.x)
        title(main=f2[[title_column]][j], col.main=col_main,sub=sub,
              xlab=xlab, ylab=ylab,
              col.lab=col_lab)
        axis(1,at = text.pos.x, labels = F)# x axis
        text(x = text.pos.x, par("usr")[3]-0.1, labels = factor_order2, srt = rotation_x, pos = 1, xpd = TRUE, cex = xlab_size)
        if(!legend_position=='none'){
          legend(legend_position,
                 factor_order1, fill=terrain.colors(length(factor_order1)))
        }
        if(!draw_single){
          dev.off()
        }
        oo=oo+1
      }
    }


  }else{
    if(is.null(factor_order1)||is.na(factor_order1)){
      factor_order1 = unique(p2[[group1]])
    }else{
      factor_order1 = strsplit(factor_order1, ",")[[1]]
    }

    if(draw_single){
      index=which(gsub(" ", "", f2[[main]], fixed = TRUE)==gsub(" ", "", compoundName, fixed = TRUE))
      oo = index
    }else{
      index=1:nrow(f2)
      oo=1
    }

    for(j in index){
      if(f2$missingremoved[j]){

      }else{

      data = data.frame(value = e2[oo,],group1 = factor(p2[[group1]],levels = factor_order1))
      if(!draw_single){
        png(paste0(j,'th_',f2[j,title_column],'.png'), width = 800, height = 600)
      }
      boxplot(value~group1,data = data,notch=FALSE,col=terrain.colors(length(factor_order1)),
              xaxt="n")
      title(main=f2[[title_column]][j], col.main=col_main,sub=sub,
            xlab=xlab, ylab=ylab,
            col.lab=col_lab)
      axis(1,at = 1:length(factor_order1), labels = F)# x axis
      text(x = 1:length(factor_order1), par("usr")[3]-0.1, labels = factor_order1, srt = rotation_x, pos = 1, xpd = TRUE, cex = xlab_size)
      legend(legend_position,
             factor_order1, fill=terrain.colors(length(factor_order1)))
      if(!draw_single){
        dev.off()
      }
      oo=oo+1
      }
    }

  }









}
