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

    {title: "Hello map", 
    content: "this is the interactive map", 
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
    content:"",
    target: ".filters",
    placement:""}, //filters
    {title:"Choose a time window", 
    content:"You can also filter by choosing a time window",
    target: ".date",
    placement:""}, //choose time window
    {title:"Show event points", 
    content:"",
    target: ".show-events",
    placement:""}, //show events
    {title:"Number of cases for clicked country or region", 
    content:"Default Latin America",
    target: ".txt-events",
    placement:""}, //event text
    {title:"Linechart of number of events per year", 
    content:"",
    target: ".linechart",
    placement:""}, //line chart
    {title:"Total number of events given variable", 
    content:"",
    target: ".barchart",
    placement:""}, //bar chart
    {title:"Display charts based on absolute number of events", 
    content:"",
    target: ".num-events",
    placement:""}, //number of events
    {title:"Select countries to display in charts", 
    content:"",
    target: ".countrytext",
    placement:""}, //countries
    {title:"Select variable for displaying bar chart", 
    content:"",
    target: ".barvariables",
    placement:""}, //variables for barchart
    {title:"Download  the entire database of events and additional variables", 
    content:"",
    target: ".download",
    placement:""}, // download csv
    {title:"Download codebook", 
    content:"",
    target: ".codebook",
    placement:""}, //codebook
    {title:"You can change language by clicking on this button", 
    content:"",
    target: ".language",
    placement:""}, //languages
    {title:"You can retart this tour whenever you click on this button", 
    content:"",
    target: ".tour",
    placement:""}, //restart tour
    {title:"Bye!", 
    content:"write something",
    target: ".intro",
    placement:"center"}, //goodbye
    ];

