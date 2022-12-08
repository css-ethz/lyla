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
    {title:"Linechart of number of events per year", 
    content:"You can compare the number of events over time for any chosen country and any given time window. The default displayed line corresponds to the number of events from the years 2010 to 2019 in Latin America.",
    target: ".linechart",
    placement:""}, //line chart
    {title:"Total number of events given variable", 
    content:"You can also compare the total number of events for a specific variable and its corresponding categories.",
    target: ".barchart",
    placement:""}, //bar chart
   
    
    {title:"You can download the entire database of events and additional variables and the codebook with the description of each of the variables in the dataset.", 
    content:"",
    target: ".download",
    placement:""}, // download csv
    {title:"Thank you", 
    content:"write something",
    target: ".intro",
    placement:"center"}, //goodbye
    ];

