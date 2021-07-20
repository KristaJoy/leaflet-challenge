// Make streetmap layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap]
});

// Function to choose color based on depth of earthquake
function chooseColor(depth) {
  if (depth >-10 && depth <=10) {
    return "#00FF21";
  }
  else if (depth >10 && depth <=30) {
    return "#F1FF00";
  }
  else if (depth >30 && depth <=50) {
    return "#FFE400";
  }
  else if (depth >50 && depth <=70) {
    return "#FCB521";
  }
  else if (depth >70 && depth <=90) {
    return "#FC8F21";
  }
  else {
    return "#FC2121";
  }
}


// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Create earthquake object
  earthquakes = data.features;
  
  //Loop through data to create markers and popups
  for (var i = 0; i < earthquakes.length; i++) {
    var location = earthquakes[i].geometry.coordinates;
    if (location) {
      L.circleMarker([location[1], location[0]], {
        fillOpacity: 1,
        color: "black",
        weight: 0.25,
        fillColor: chooseColor(earthquakes[i].geometry.coordinates[2]),
        radius: earthquakes[i].properties.mag * 3,
      })
      .bindPopup("<h3>Magnitude: " + earthquakes[i].properties.mag +
          "</h3><hr><p>Location: " + earthquakes[i].properties.place + 
          "</p><p>Depth: " + earthquakes[i].geometry.coordinates[2] + " km</p>")
        .addTo(myMap);
    }
  }
});

 