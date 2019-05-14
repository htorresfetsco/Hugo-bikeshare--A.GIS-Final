/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log('hi');

// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [40.71, -73.94],
  zoom: 12
});

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'torrh257'
});


// select the block here so we can refer to it later
var suggestlocation = document.querySelector('#formpopup');
var suggestlocationFormEnabled = false; // Hold onto the state of the location form


// When the select a location button is clicked, show the forminput block and allow event listen to set a marker on map
var suggestlocationbutton = document.querySelector('.toggle-suggestlocationbutton');
console.log('.toggle-suggestlocationbutton');
suggestlocationbutton.addEventListener('click', function () {
  if (suggestlocation) {
    
    suggestlocation.style.display = 'block';
    suggestlocationFormEnabled = true; // Now we know it has been enabled
  }
  else {
    suggestlocationFormEnabled = false; // Form was turned off
  }
});

// Initialze source data - Census Tracts Toggle
var censussource = new carto.source.SQL('SELECT * FROM nyc_block_group_census');

// Create style for the data
var censusstyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0;
}
#layer::outline {
  line-width: 1;
  line-color: transparent;
  line-opacity: 0;
}
`)

// Add style to the data
var censuslayer = new carto.layer.Layer(censussource, censusstyle);

// Add the data to the map as a layer
client.addLayer(censuslayer);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPickercensus = document.querySelector('.layer-pickercensus');

// select the legend here so we can refer to it later
var censusEthnicityLegend = document.querySelector('#ethnicitylegend');
var censusLegendchoroplethIncome = document.querySelector('#legendchoroplethincome');
var censusLegendchoroplethAge = document.querySelector('#legendchoroplethage');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPickercensus.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var column1 = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (column1 === 'off1') {
    console.log('off1');
    // If the value is "all" then we show all of the features, unfiltered
    censusstyle.setContent(`
#layer {
  polygon-fill: #ffffff;
  polygon-opacity: 0;
}
#layer::outline {
  line-width: 1;
  line-color: transparent;
  line-opacity: 0;
}`);
    
    // hide ethnicity legend
    censusEthnicityLegend.style.display = 'none';
    censusLegendchoroplethIncome.style.display = 'none';
    censusLegendchoroplethAge.style.display = 'none';
  }
  
  if (column1 === 'race') {
    console.log('race');
    // If the value is "all" then we show all of the features, unfiltered
    censusstyle.setContent(`
#layer {
  polygon-fill: ramp([ethnic_1st], (#7F3C8D, #11A579, #3969AC, #F2B701, #E73F74, #A5AA99), ("white", "hispanic or latino", "black", "asian", "other"), "=");
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}`);
    
     // show ethnicity legend
    censusEthnicityLegend.style.display = 'block';
    censusLegendchoroplethIncome.style.display = 'none';
    censusLegendchoroplethAge.style.display = 'none';
  }
  
  if (column1 === 'income') {
    console.log('income');
    // If the value is "all" then we show all of the features, unfiltered
    censusstyle.setContent(`
#layer {
  polygon-fill: ramp([median_household_income], (#f7feae, #9bd8a4, #46aea0, #058092, #045275), quantiles);
}
#layer::outline {
  line-width: 1.5;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}`);
    
    // hide ethnicity legend
    censusEthnicityLegend.style.display = 'none';
    censusLegendchoroplethIncome.style.display = 'block';
    censusLegendchoroplethAge.style.display = 'none';
  }
  
  if (column1 === 'age') {
    console.log('age');
    // If the value is "all" then we show all of the features, unfiltered
    censusstyle.setContent(`
#layer {
  polygon-fill: ramp([median_age], (#f3e0f7, #e0c2ef, #c8a5e4, #aa8bd4, #8871be, #63589f), quantiles);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}`);
    
    // hide ethnicity legend
    censusEthnicityLegend.style.display = 'none';
    censusLegendchoroplethIncome.style.display = 'none';
    censusLegendchoroplethAge.style.display = 'block';
  }

});

// Initialze source data - Priority Districts
var prioritydistrictsource = new carto.source.SQL('SELECT * FROM dot_vzv_bike_priority_districts');

// Create style for the data
var prioritydistrictstyle = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: #d7cf00;
  polygon-opacity: 0.26;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`)

// Add style to the data
var prioritydistrictlayer = new carto.layer.Layer(prioritydistrictsource, prioritydistrictstyle);

// Add the data to the map as a layer
client.addLayer(prioritydistrictlayer);
client.getLeafletLayer().addTo(map);



// Keep track of whether the layer is currently visible
var prioritydistrictvisible = true;

// When the bike lane button is clicked, show or hide the layer
var prioritydistrictbutton = document.querySelector('.toggle-prioritydistrictbutton');
prioritydistrictbutton.addEventListener('click', function () {
  if (prioritydistrictvisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(prioritydistrictlayer);
    
    // Then update the variable tracking whether the layer is shown
    prioritydistrictvisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(prioritydistrictlayer);
    prioritydistrictvisible = true;
    
  }
});

// Initialze source data - nycha housing
var nychasource = new carto.source.SQL('SELECT * FROM nycha_developments_july2011');

// Create style for the data
var nychastyle = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: #E58606;
  polygon-opacity: 1;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`)

// Add style to the data
var nychalayer = new carto.layer.Layer(nychasource, nychastyle);

// Add the data to the map as a layer
client.addLayer(nychalayer);
client.getLeafletLayer().addTo(map);



// Keep track of whether the layer is currently visible
var nychavisible = true;

// When the bike lane button is clicked, show or hide the layer
var nychabutton = document.querySelector('.toggle-nychabutton');
nychabutton.addEventListener('click', function () {
  if (nychavisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(nychalayer);
    
    // Then update the variable tracking whether the layer is shown
    nychavisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(nychalayer);
    nychavisible = true;
    
  }
});


// Initialze source data - Bike Lanes Routes
var bikeroutesource = new carto.source.SQL('SELECT * FROM nyc_bike_routes_2017');

// Create style for the data
var bikeroutestyle = new carto.style.CartoCSS(`
 #layer {
  line-width: 1.5;
  line-color: green;
  line-opacity: 100;
}
`)

// Add style to the data
var bikeroutelayer = new carto.layer.Layer(bikeroutesource, bikeroutestyle);

// Add the data to the map as a layer
client.addLayer(bikeroutelayer);
client.getLeafletLayer().addTo(map);


// Initialze source data - Bike Lanes Routes Data only
var bikeroutesourceD = new carto.source.SQL('SELECT * FROM nyc_bike_routes_2017');

// Create style for the data
var bikeroutestyleD = new carto.style.CartoCSS(`
 #layer {
  line-width: 1.5;
  line-color: green;
  line-opacity: 100;
}
`)

// Add style to the data
var bikeroutelayerD = new carto.layer.Layer(bikeroutesourceD, bikeroutestyleD);

// Add the data to the map as a layer
client.addLayer(bikeroutelayerD);
client.getLeafletLayer().addTo(map);


// Keep track of whether the citibike layer is currently visible
var bikelanevisible = true;

// When the bike lane button is clicked, show or hide the layer
var bikelanebutton = document.querySelector('.toggle-bikelanebutton');
bikelanebutton.addEventListener('click', function () {
  if (bikelanevisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(bikeroutelayer);
    
    // Then update the variable tracking whether the layer is shown
    bikelanevisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(bikeroutelayer);
    bikelanevisible = true;
    
  }
});

// Keep track of whether the citibike layer is currently visible
var bikelanevisibleD = true;

// When the bike lane button is clicked, show or hide the layer
var bikelanebuttonD = document.querySelector('.toggle-bikelanebutton');
bikelanebuttonD.addEventListener('click', function () {
  if (bikelanevisibleD) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(bikeroutelayerD);
    
    // Then update the variable tracking whether the layer is shown
    bikelanevisibleD = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(bikeroutelayerD);
    bikelanevisibleD = true;
    
  }
});


// Initialze source data - Subway Lines
var subwaylinesource = new carto.source.SQL('SELECT * FROM nyc_subway_line');

// Create style for the data
var subwaylinestyle = new carto.style.CartoCSS(`
 #layer {
  line-width: 1.5;
  line-color: ramp([color], (#fd7b3b, #fd3924, #fff23a, #2744fd, #2f7136, #491414, #4e514d, #82c74d, #615f5f, #6928bc, #000000), ("orange", "red", "yellow", "blue", "green", "brown", "dark grey", "light green", "grey", "pruple"), "=");
}
`)

// Add style to the data
var subwaylinelayer = new carto.layer.Layer(subwaylinesource, subwaylinestyle);

// Add the data to the map as a layer
client.addLayer(subwaylinelayer);
client.getLeafletLayer().addTo(map);


// Initialze source data - Subway Lines Data only
var subwaylinesourceD = new carto.source.SQL('SELECT * FROM nyc_subway_line');

// Create style for the data
var subwaylinestyleD = new carto.style.CartoCSS(`
 #layer {
  line-width: 1.5;
  line-color: ramp([color], (#fd7b3b, #fd3924, #fff23a, #2744fd, #2f7136, #491414, #4e514d, #82c74d, #615f5f, #6928bc, #000000), ("orange", "red", "yellow", "blue", "green", "brown", "dark grey", "light green", "grey", "pruple"), "=");
}
`)

// Add style to the data
var subwaylinelayerD = new carto.layer.Layer(subwaylinesourceD, subwaylinestyleD);

// Add the data to the map as a layer
client.addLayer(subwaylinelayerD);
client.getLeafletLayer().addTo(map);

/*
 * // Keep track of whether the subway layer is currently visible
 */


var subwaylinevisible = true;



// When the subway button is clicked, show or hide the layer
var subwaylinebutton = document.querySelector('.toggle-subwaylinebutton');
subwaylinebutton.addEventListener('click', function () {
  if (subwaylinevisible) {
    // Subways are visible, so remove that layer
    client.removeLayer(subwaylinelayer);
    
    // Then update the variable tracking whether the layer is shown
    subwaylinevisible = false;
  }
  else {
    // Do the reverse if subways are not visible
    client.addLayer(subwaylinelayer);
    subwaylinevisible = true;
    
  }
});

// Keep track of whether the subway layer is currently visible
var subwaylinevisibleD = true;

// When the subway button is clicked, show or hide the layer
var subwaylinebuttonD = document.querySelector('.toggle-subwaylinebutton');
subwaylinebuttonD.addEventListener('click', function () {
  if (subwaylinevisibleD) {
    // Subways are visible, so remove that layer
    client.removeLayer(subwaylinelayerD);
    
    // Then update the variable tracking whether the layer is shown
    subwaylinevisibleD = false;
  }
  else {
    // Do the reverse if subways are not visible
    client.addLayer(subwaylinelayerD);
    subwaylinevisibleD = true;
    
  }
});

// Initialze source data - Subway Stations
var subwaystationsource = new carto.source.SQL('SELECT * FROM subway_stations_color');

// Create style for the data
var subwaystationstyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 7;
  marker-fill: ramp([grey], (#ff4545, #3e4bff, #ff8b16, #317426, #ffed48, #643434, #919191, #90e260, #951bff, #545454, #000000), ("red", "blue", "orange", "green", "yellow", "brown", "grey", "light green", "purple", "dark grey"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`)

// Add style to the data
var subwaystationlayer = new carto.layer.Layer(subwaystationsource, subwaystationstyle);

// Add the data to the map as a layer
client.addLayer(subwaystationlayer);
client.getLeafletLayer().addTo(map);

// Initialze source data - Subway Stations Data only
var subwaystationsourceD = new carto.source.SQL('SELECT * FROM subway_stations_color');

// Create style for the data
var subwaystationstyleD = new carto.style.CartoCSS(`
 #layer {
  marker-width: 7;
  marker-fill: ramp([grey], (#ff4545, #3e4bff, #ff8b16, #317426, #ffed48, #643434, #919191, #90e260, #951bff, #545454, #000000), ("red", "blue", "orange", "green", "yellow", "brown", "grey", "light green", "purple", "dark grey"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`)

// Add style to the data
var subwaystationlayerD = new carto.layer.Layer(subwaystationsourceD, subwaystationstyleD);

// Add the data to the map as a layer
client.addLayer(subwaystationlayerD);
client.getLeafletLayer().addTo(map);

// Keep track of whether the citibike layer is currently visible
var subwaystationvisible = true;

// When the bike lane button is clicked, show or hide the layer
var subwaystationbutton = document.querySelector('.toggle-subwaystationbutton');
subwaystationbutton.addEventListener('click', function () {
  if (subwaystationvisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(subwaystationlayer);
    
    // Then update the variable tracking whether the layer is shown
    subwaystationvisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(subwaystationlayer);
    subwaystationvisible = true;
    
  }
});

// Keep track of whether the citibike layer is currently visible
var subwaystationvisibleD = true;

// When the bike lane button is clicked, show or hide the layer
var subwaystationbuttonD = document.querySelector('.toggle-subwaystationbutton');
subwaystationbuttonD.addEventListener('click', function () {
  if (subwaystationvisibleD) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(subwaystationlayerD);
    
    // Then update the variable tracking whether the layer is shown
    subwaystationvisibleD = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(subwaystationlayerD);
    subwaystationvisibleD = true;
    
  }
});



// Initialze source data - Proposed Bike Station Data only
var proposedsource = new carto.source.SQL('SELECT * FROM choose_a_citi_bike_location_responses');

// Create style for the data
var proposedstyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 16.5;
  marker-fill: #EE4D5A;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/torrh257/assets/20190430073121location_map_pin_turquoise_blue7.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`)

// Add style to the data
var proposedlayer = new carto.layer.Layer(proposedsource, proposedstyle, {
  featureClickColumns: ['your_name','briefly_describe_your_proposed_location','your_age','your_zipcode','timestamp']
});

proposedlayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var proposedcontent = ('<h3>' + event.data['your_name'] + '</h3>') + ('<h2>' + event.data['briefly_describe_your_proposed_location'] + '</h2>')+ ('<h4>' + event.data['your_age'] + '</h4>')+ ('<h4>' + event.data['your_zipcode'] + '</h4>') + ('<h4>' + event.data['timestamp'] + '</h4>');
  
  
  // If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var proposedpopup = L.popup();
  proposedpopup.setContent(proposedcontent);
  
  // Place the popup and open it
  proposedpopup.setLatLng(event.latLng);
  proposedpopup.openOn(map);
});


// Add the data to the map as a layer
client.addLayer(proposedlayer);
client.getLeafletLayer().addTo(map);


// Keep track of whether the bike layer is currently visible
var proposedvisible = true;

// When the citbike button is clicked, show or hide the layer
var proposedbutton = document.querySelector('.toggle-proposedbutton');
proposedbutton.addEventListener('click', function () {
  if (proposedvisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(proposedlayer);
    
    // Then update the variable tracking whether the layer is shown
    proposedvisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(proposedlayer);
    proposedvisible = true;
    
  }
});


// Initialze source data - Citi Bike Station Data only
var citibikesourceD = new carto.source.SQL('SELECT * FROM bikeshare_nyc_raw_lat_lon');

// Create style for the data
var citibikestyleD = new carto.style.CartoCSS(`
 #layer {
  marker-width: 5.5;
  marker-fill: #EE4D5A;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/torrh257/assets/20190430073430BicycleMarkerSymbol.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
[zoom <= 13] {
   marker-width: 7; 
  }  
}
`)

// Add style to the data
var citibikelayerD = new carto.layer.Layer(citibikesourceD, citibikestyleD);

// Add the data to the map as a layer
client.addLayer(citibikelayerD);
client.getLeafletLayer().addTo(map);


// Keep track of whether the citibike layer is currently visible
var citibikevisible = true;

// When the citbike button is clicked, show or hide the layer
var citibikebutton = document.querySelector('.toggle-citibikebutton');
citibikebutton.addEventListener('click', function () {
  if (citibikevisible) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(citibikelayer);
    
    // Then update the variable tracking whether the layer is shown
    citibikevisible = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(citibikelayer);
    citibikevisible = true;
    
  }
});

// Keep track of whether the citibike layer is currently visible
var citibikevisibleD = true;

// When the citbike button is clicked, show or hide the layer
var citibikebuttonD = document.querySelector('.toggle-citibikebutton');
citibikebuttonD.addEventListener('click', function () {
  if (citibikevisibleD) {
    // Citibikes are visible, so remove that layer
    client.removeLayer(citibikelayerD);
    
    // Then update the variable tracking whether the layer is shown
    citibikevisibleD = false;
  }
  else {
    // Do the reverse if citibikes are not visible
    client.addLayer(citibikelayerD);
    citibikevisibleD = true;
    
  }
});


// Initialze source data - Citi Bike Stations
var citibikesource = new carto.source.SQL('SELECT * FROM bikeshare_nyc_raw_lat_lon');

// Create style for the data
var citibikestyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 16.5;
  marker-fill: #EE4D5A;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/torrh257/assets/20190430073430BicycleMarkerSymbol.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
[zoom <= 13] {
   marker-width: 7; 
  }  
}
`)

// Add style to the data
var citibikelayer = new carto.layer.Layer(citibikesource, citibikestyle, {
  featureClickColumns: ['dock_name']
});

citibikelayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var citibikecontent = '<h1>' + event.data['dock_name'] + '</h1>';
  
  // If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var citibikepopup = L.popup();
  citibikepopup.setContent(citibikecontent);
  
  // Place the popup and open it
  citibikepopup.setLatLng(event.latLng);
  citibikepopup.openOn(map);
});


// Add the data to the map as a layer
client.addLayer(citibikelayer);
client.getLeafletLayer().addTo(map);



map.on('click', function (e) {
  console.log(e.latlng);
  
  // We want the SQL to look something like this (lat: 40.732, lng: -73.986)
  // SELECT * FROM nypd_motor_vehicle_collisions WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(40.732,-73.986), 2263),10000))
  
  //Bike Lane
  // So place the lat and lng in the query at the appropriate points
  var sqlbikeroute = 'SELECT * FROM nyc_bike_routes_2017 WHERE ST_Intersects(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqlbikeroute);
  
  bikeroutesource.setQuery(sqlbikeroute);
  
  // Make SQL to get the summary data you want
  var countSql1 = 'SELECT Sum(ST_length(ST_Transform(the_geom, 2263))) FROM nyc_bike_routes_2017 WHERE ST_Intersects(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  

  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var bikelanemiles = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer1 = document.querySelector('.sidebar-feature-content1');

      // Add the text including the sum to the sidebar
      sidebarContainer1.innerHTML = '<div>' + (Math.round(bikelanemiles*100/5280))/100 + ' miles of Bike Lanes in this area</div>';
    });

  
    //Train Station
  // So place the lat and lng in the query at the appropriate points
  var sqltrainstop = 'SELECT * FROM subway_stations_color WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqltrainstop);
  
  subwaystationsource.setQuery(sqltrainstop);
  
  // Make SQL to get the summary data you want
  var countSql2 = 'SELECT SUM(train_stop) FROM subway_stations_color WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var trainstop = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer2 = document.querySelector('.sidebar-feature-content2');

      // Add the text including the sum to the sidebar
      sidebarContainer2.innerHTML = '<div>' + Math.round(trainstop) + ' train stops in this area</div>';
    });
    
  
    //Census Track Income
  // So place the lat and lng in the query at the appropriate points
  var sqlcensus = 'SELECT * FROM nyc_block_group_census WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqlcensus);
  
  censussource.setQuery(sqlcensus);
  
  // Make SQL to get the summary data you want
  var countSql3 = 'SELECT AVG(median_household_income) FROM nyc_block_group_census WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql3)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var censusdata = data.rows[0].avg;

      // Get the sidebar container element
      var sidebarContainer3 = document.querySelector('.sidebar-feature-content3');

      // Add the text including the sum to the sidebar
      sidebarContainer3.innerHTML = '<div>The median household income is $' + Math.round(censusdata*100)/100 + ' in this area</div>';
  });

  
    //Census Track Age
  // So place the lat and lng in the query at the appropriate points
  var sqlcensus = 'SELECT * FROM nyc_block_group_census WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqlcensus);
  
  censussource.setQuery(sqlcensus);
  
  // Make SQL to get the summary data you want
  var countSql4 = 'SELECT AVG(median_age) FROM nyc_block_group_census WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql4)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var censusdata = data.rows[0].avg;

      // Get the sidebar container element
      var sidebarContainer4 = document.querySelector('.sidebar-feature-content4');

      // Add the text including the sum to the sidebar
      sidebarContainer4.innerHTML = '<div>The average age is ' + Math.round(censusdata) + ' in this area</div>';
  });
  
    //Bike Stations
  // So place the lat and lng in the query at the appropriate points
  var sqlcitibike = 'SELECT * FROM bikeshare_nyc_raw_lat_lon WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqlcitibike);
  
  citibikesource.setQuery(sqlcitibike);
  
  // Make SQL to get the summary data you want
  var countSql5 = 'SELECT SUM(in_service) FROM bikeshare_nyc_raw_lat_lon WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql5)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var citibikedata = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer5 = document.querySelector('.sidebar-feature-content5');

      // Add the text including the sum to the sidebar
      sidebarContainer5.innerHTML = '<div>' + Math.round(citibikedata) + ' Citi Bike stations in this area</div>';
  });
  
  //Subway Lines
  // So place the lat and lng in the query at the appropriate points
  var sqlsubwayline = 'SELECT * FROM nyc_subway_line WHERE ST_Within(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  console.log(sqlsubwayline);
  
  subwaylinesource.setQuery(sqlsubwayline);
  
  // Make SQL to get the summary data you want
  var countSql6 = 'SELECT Sum(ST_length(ST_Transform(the_geom, 2263))) FROM nyc_subway_line WHERE ST_Intersects(ST_Transform(the_geom, 2263), ST_Buffer(ST_Transform(CDB_LatLng(' + e.latlng.lat + ',' + e.latlng.lng + '), 2263),2500))';
  
  // Request the data from Carto using fetch.
  // You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
  fetch('https://torrh257.carto.com/api/v2/sql/?q=' + countSql6)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // All of the data returned is in the response variable
      console.log(data);

      // The sum is in the first row's sum variable
      var subwaylinemiles = data.rows[0].sum;

      // Get the sidebar container element
      var sidebarContainer6 = document.querySelector('.sidebar-feature-content6');

      // Add the text including the sum to the sidebar
      sidebarContainer6.innerHTML = '<div>There are ' + (Math.round(subwaylinemiles*100/5280))/100 + ' miles of Subway Lines in this area</div>';
    });
      });
  
  /*
 * Add event listener to the map that updates the latitude and longitude on the form
 */

var latitudeField = document.querySelector('.latitude-field');
var longitudeField = document.querySelector('.longitude-field');

var markerLayer = L.featureGroup().addTo(map);

map.on('click', function (event) {
  
  // Clear the existing marker
  markerLayer.clearLayers();
  
  // Log out the latlng so we can see that it's correct
  console.log(event.latlng);
  document.querySelector('.submit-button').removeAttribute('disabled')
  
  // Add a marker to the map
  var marker = L.marker(event.latlng);
  markerLayer.addLayer(marker);
  
  
  
  // Update the form fields
  latitudeField.value = event.latlng.lat;
  longitudeField.value = event.latlng.lng;
  });

