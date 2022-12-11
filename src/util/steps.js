export const steps_joyride = [
    {title: "Welcome to the LYLA Dashboard",
    content: "This web application enables researchers and journalists to analyze lynching events in Latin America.", 
    target: ".intro", 
    placement:"center",
    floaterProps: {
      hideArrow: true
    },
    disableBeacon: true,
    styles: {
      options: {
        width: 200,
      }

    }},

    {title: "Interactive map", 
    content: "In this map you can observe the amount of lynching events per country. You can click on any country in order to display the distribution of lynchings within the chosen country. By clicking on the Show events button, exact coordinates of each of the events are shown", 
    target: ".regionMap", 
    placement:"right",
    isFixed: true,
    styles: {
      options: {
        zIndex: 1000,
        width: 200,
        height: 100
        
      }

    }},
    {title:"Filtering the events", 
    content:"You can filter the information to be displayed on both the map and the charts on the right hand side by using the filter buttons and/or the date slider.",
    target: ".filters",
    placement:""}, //filters
    {title:"Line chart of number of events per year", 
    content:"You can compare the number of events over time for any chosen country and any given time window. The default displayed line corresponds to the number of events from the years 2010 to 2019 in Latin America.",
    target: ".linechart",
    placement:""}, //line chart
    {title:"Bar chart of total events", 
    content:"You can also compare the total number of events for a specific variable and its corresponding categories.",
    target: ".barchart",
    placement:""}, //bar chart
   
    
    {title:"Downloads", 
    content:"Finally, you can download the entire database of events and additional variables and the codebook with the description of each of the variables in the dataset.",
    target: ".download",
    placement:""}, // download csv
   
    ];

    export const steps_joyride_es = [
      {title: "Bienvenid@ al LYLA Dashboard",
      content: "Esta aplicación web permite a investigadores y periodistas analizar eventos de linchamiento en América Latina.", 
      target: ".intro", 
      placement:"center",
      floaterProps: {
        hideArrow: true
      },
      disableBeacon: true,
      styles: {
        options: {
          width: 200,
        }
  
      }},
  
      {title: "Mapa interactivoInteractive map", 
      content: "En este mapa puedes observar la distribución de linchamientos a nivel América Latina. Puedes hacer clic en cualquier país para observar la distribución a nivel país. Puedes dar clic en Mostrar eventos para ver las coordenadas exactas de cada uno de los eventos.", 
      target: ".regionMap", 
      placement:"right",
      isFixed: true,
      styles: {
        options: {
          zIndex: 1000,
          width: 200,
          height: 100
          
        }
  
      }},
      {title:"Filtros", 
      content:"Puedes filtrar la información a desplegar en el mapa y gráficas por medio de los filtros y/o seleccionaodr de fechas.",
      target: ".filters",
      placement:""}, //filters
      {title:"Gráfica de número de eventos por año", 
      content:"Puedes comparar el número de eventos en distintos países a treavés del tiempo seleccionado con el seleccionador de ventana de tiempo. La gráfica mostrada por default corresponde al número de casos anuales a nivel América Latina en los año 201-2019.",
      target: ".linechart",
      placement:""}, //line chart
      {title:"Gráfica de barras de casos totales", 
      content:"También puedes comparar el número total de casos por país y por variable específica.",
      target: ".barchart",
      placement:""}, //bar chart
     
      
      {title:"Descargas", 
      content:"Finalmente, puedes descargar la base de datos completa con variables adicionales, así como el codebook con la descripción de cada una de las variables proporcionadas.",
      target: ".download",
      placement:""}, // download csv
     
      ];
  
  