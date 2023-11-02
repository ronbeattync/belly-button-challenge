// Constants
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the dashboard
function init() {
  // Read data from the JSON file
  d3.json(dataURL).then(function(data) {
    // Get the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown menu with sample IDs
    data.names.forEach(function(name) {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    // Call the functions to create the plots and display metadata for the initial sample
    optionChanged(data.names[0]);
  });
}

// Function to update plots and metadata when a new sample is selected
function optionChanged(sampleId) {
  // Read data from the JSON file
  d3.json(dataURL).then(function(data) {
    // Filter data for the selected sample
    var selectedSample = data.samples.find(sample => sample.id === sampleId);
    var metadata = data.metadata.find(item => item.id === parseInt(sampleId));

    // Create horizontal bar chart
    var barData = [{
      y: selectedSample.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      x: selectedSample.sample_values.slice(0, 10).reverse(),
      text: selectedSample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    var barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 50, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create bubble chart
    var bubbleData = [{
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      }
    }];

    var bubbleLayout = {
      title: "OTU ID vs Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Display metadata
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Initialize the dashboard
init();