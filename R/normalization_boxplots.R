#' normalization_boxplots
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_boxplots()

normalization_boxplots <- function(e2,f2,p2,
                                   color1 = "treatment",
                                   color2 = "mx class",
                                   sampleName = "phenotypeindex"){
  library(jsonlite)
  library(grDevices)
  cols1 = normalization_gg_color_hue(length(unique(p2[[color1]])))
  cols2 = gray.colors(length(unique(p2[[color2]])))


  if(color1%in%colnames(p2)){
    color1 = cols1[as.numeric(as.factor(p2[[color1]]))]
  }else{
    color1 = NULL
  }
  if(color2%in%colnames(p2)){
    color2 = cols2[as.numeric(as.factor(p2[[color2]]))]
  }else{
    color2 = NULL
  }

  data = list()
  for(i in 1:ncol(e2)){
    data[[i]] = list(
      y = c(e2[,i]),
      boxpoints = "all",
      fillcolor = color2[i],
      jitter = 0.4,
      line = list(width = 1),
      marker = list(
        line = list(width = 0),
        opacity = 0.9,
        size = 2,
        color = color1[i]
      ),
      name = p2[[sampleName]][i],
      opacity = 0.99,
      type = "box"
    )
  }
  layout <- list(
    bargap = 0.2,
    bargroupgap = 0,
    barmode = "stack",
    boxgap = 0.2,
    boxgroupgap = 0.3,
    boxmode = "overlay",
    dragmode = "zoom",
    font = list(
      color = "#000",
      family = "Arial, sans-serif",
      size = 12
    ),
    hovermode = "x",
    legend = list(
      bgcolor = "#fff",
      bordercolor = "#000",
      borderwidth = 1,
      font = list(
        color = "",
        family = "",
        size = 0
      ),
      traceorder = "normal"
    ),
    margin = list(
      r = 80,
      t = 80,
      b = 140,
      l = 80,
      pad = 2
    ),
    paper_bgcolor = "rgb(255, 255, 255)",
    plot_bgcolor = "rgb(255, 255, 255)",
    showlegend = FALSE,
    title = "boxplot of each compound",
    titlefont = list(
      color = "",
      family = "",
      size = 0
    ),
    xaxis = list(
      autorange = TRUE,
      autotick = TRUE,
      dtick = 1,
      exponentformat = "e",
      gridcolor = "#ddd",
      gridwidth = 1,
      linecolor = "rgb(255, 255, 255)",
      linewidth = 0.1,
      mirror = TRUE,
      nticks = 0,
      range = c(-1.44864344477, 50.3540302404),
      showexponent = "all",
      showgrid = FALSE,
      showticklabels = TRUE,
      tick0 = 0,
      tickangle = 90,
      tickcolor = "#000",
      tickfont = list(
        color = "",
        family = "",
        size = 12
      ),
      ticklen = 5,
      ticks = "",
      tickwidth = 1,
      title = "",
      titlefont = list(
        color = "",
        family = "",
        size = 0
      ),
      type = "category",
      zeroline = FALSE,
      zerolinecolor = "#000",
      zerolinewidth = 1
    ),
    yaxis = list(
      autorange = TRUE,
      autotick = TRUE,
      dtick = 10,
      exponentformat = "e",
      gridcolor = "white",
      gridwidth = 1,
      linecolor = "rgb(255, 255, 255)",
      linewidth = 0.1,
      mirror = TRUE,
      nticks = 0,
      range = c(-1.0, 55),
      showexponent = "all",
      showgrid = FALSE,
      showticklabels = TRUE,
      tick0 = 0,
      tickangle = "auto",
      tickcolor = "#000",
      tickfont = list(
        color = "",
        family = "",
        size = 0
      ),
      ticklen = 5,
      ticks = "",
      tickwidth = 1,
      title = "Points",
      titlefont = list(
        color = "",
        family = "",
        size = 0
      ),
      type = "linear",
      zeroline = FALSE,
      zerolinecolor = "#000",
      zerolinewidth = 1
    )
  )

  data = jsonlite::toJSON(data,auto_unbox=T)
  layout = jsonlite::toJSON(layout,auto_unbox=T)
  return(list(data=data,layout=layout))
}
