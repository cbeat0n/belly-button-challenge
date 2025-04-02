// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata ;

    // Filter the metadata for the object with the desired sample number
  
    metadata = metadata.find(number => number.id == sample);
    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata = d3.select("#sample-metadata") ;

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("") ;
    
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadata).forEach(([key , value]) => {
      sampleMetadata.append("p").text(`${key.toUpperCase()}: ${value}`);
    }); 
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let mySamples = data.samples ;

    // Filter the samples for the object with the desired sample number
    
    mySamples = mySamples.filter(number => number.id == sample)[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = mySamples.otu_ids ;
    let otu_labels = mySamples.otu_labels ;
    let sample_values = mySamples.sample_values ;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids ,
      y: sample_values,
      text: otu_labels ,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];
    
    
    let layout = {
      title: {
        text: 'Bacteria Culture per Sample'
      },
      showlegend: false,
      xaxis: {
        title: 'OTU ID'  // X-axis label
      },
      yaxis: {
        title: 'Number of Bacteria'  // Y-axis label
      },
      height: 600,
      width: 1050 
    };
    
    

    // Render the Bubble Chart
    Plotly.newPlot(d3.select("#bubble").node(), bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let newIds = otu_ids.map((x) => `OTU ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let sortedValues = sample_values.sort((firstNum, secondNum) => secondNum - firstNum).slice(0,10).reverse();
    
    let sortedIds = [];

    let sortedLabels = [];

    for (let i = 0 ; i < sortedValues.length ; i++){
      sortedIds.push(newIds[sample_values.indexOf(sortedValues[i])] )
      sortedLabels.push(newIds[sample_values.indexOf(sortedValues[i])])
    };



    sortedIds = sortedIds.slice(0,10);

    let barData = [{
      type: 'bar',
      x: sortedValues ,
      y: sortedIds,
      text : sortedLabels,
      orientation: 'h'
    }];
    
    let barLayout = {
      title: {
        text: 'Top 10 Bacteria Cultures Found'
      },
      yaxis: {
        type: 'category',  // Ensure y-axis is treated as categorical
      },
      bargap: 0.05,  // Adjust the gap between bars
      bargroupgap: 0.1,
      xaxis: {
        title: 'Number of Bacteria'  // Y-axis label
      }
    };

    // Render the Bar Chart
    Plotly.newPlot(d3.select("#bar").node(), barData , barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0 ; i < names.length ; i++){
      dropdown.append("option").text(`${names[i]}`)
    };

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
 
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Initialize the dashboard
init();
