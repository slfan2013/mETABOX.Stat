#' normalization_PCA
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_PCA()

normalization_PCA <- function(e2,f2,p2,
                                   color = "species",
                                   shape = 'no_shape',
                              opacity = 0.5,ellipse_needed = TRUE,ellipseLineType='solid',
                              showlegend = TRUE,dotsize=15,ellipse_line_width = 1,
                              confidence_level = 0.95,
                              paper_bgcolor = "rgba(245,246,249,1)",
                              plot_bgcolor = "rgba(245,246,249,1)",

                              width=1000,height=1000,
                              title = NULL
                              ){
  library(jsonlite)
  cols = normalization_gg_color_hue(length(unique(p2[[color]])))

  pca = prcomp(t(e2), center = F, scale. = F)
  score = pca$x
  score = data.frame(score,p2,check.names = FALSE)
  if(shape%in%colnames(p2)){
    score$shape = as.numeric(as.factor(p2[[shape]]))-1
  }else{
    score$shape = 0
  }
  if(color%in%colnames(p2)){
    score$color = cols[as.numeric(as.factor(p2[[color]]))]
  }else{
    score$color = 'light grey'
  }

  # rownames(score) = rownames(e)
  variance = pca$sdev^2/sum(pca$sdev^2)

  scatter = by(score,p2[[color]],FUN=function(x){ # this is for the scatters.
    # x = score[p2[[color]]==p2[[color]][1],]
    text.temp = apply(x[colnames(p2)],1,function(o){
      paste(paste(colnames(p2),o, sep=": "),collapse = "</br>")
    })

    if(ellipse_needed){
      ellipse = tryCatch({
        ell.info <- cov.wt(cbind(x[,1], x[,2]))
        eigen.info <- eigen(ell.info$cov)
        lengths <- sqrt(eigen.info$values * 2 * qf(as.numeric(confidence_level), 2, length(x[,1])-1))
        d = rbind(ell.info$center + lengths[1] * eigen.info$vectors[,1],
                  ell.info$center - lengths[1] * eigen.info$vectors[,1],
                  ell.info$center + lengths[2] * eigen.info$vectors[,2],
                  ell.info$center - lengths[2] * eigen.info$vectors[,2])
        r <- cluster::ellipsoidhull(d)
        predict(r,100)
      },error = function(e){
        NULL
      })
    }else{
      ellipse = NULL
    }


    list(list(x = x[,1], y = x[,2]
              ,mode = 'markers',type='scatter'
              ,name = x[[color]][1]
              ,text = text.temp,showlegend=showlegend,
              marker=list(
                symbol = x$shape,
                color=x$color[1],
                size = dotsize,
                opacity=opacity)
    ),
    list(x = ellipse[,1], y = ellipse[,2] # this is for the ellipse.
         ,mode = 'lines',
         line= list(dash=ellipseLineType,width=ellipse_line_width)
         ,hoverinfo='none'
         ,name = x$color[1]
         ,showlegend=FALSE
         ,opacity=opacity
         ,marker=list(color=x$color[1])
    ))
  },simplify =F)

  data = list()
  for(i in 1:length(scatter)){
    data[[i]] = scatter[[i]][[1]]
    # data[[i]]$marker =  list(color = cols[i] , size = 18)
    data[[i+length(scatter)]] = scatter[[i]][[2]] # these are for the ellipse.
    # data[[i+length(scatter)]]$marker =  list(color = cols[i])
  }

  layout = list(paper_bgcolor = paper_bgcolor,
                 plot_bgcolor = plot_bgcolor,
                width=as.numeric(width),
                height=as.numeric(height),
                title= title,
                 xaxis = list(
                   title = paste0("PC 1 (",round(variance[1],4) * 100,"%)"),
                   titlefont = list(
                     family="Courier New, monospace",
                     size = 18, color = "#7f7f7f"
                   )
                 ),
                 yaxis=list(
                   title = paste0("PC 2 (",round(variance[2],4) * 100,"%)"),
                   titlefont = list(
                     family="Courier New, monospace",
                     size = 18, color = "#7f7f7f"
                   )
                 ),
                 legend=list(
                   xanchor="auto"
                 )
  )

  data = jsonlite::toJSON(data,auto_unbox=T)
  layout = jsonlite::toJSON(layout,auto_unbox=T)
  return(list(data=data,layout=layout))
}
