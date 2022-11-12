// Creating the map
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// another map layer
var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

// another map layer
var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

// basemaps
let basemaps = 
{
    Watercolor: watercolor,
    Terrain: terrain,
    Topography: topo,
}

var myMap = L.map("map", 
    {center: [33.7490, -84.3880],
    zoom: 4,
    layers: [watercolor, terrain, topo]
});

// add maps
topo.addTo(myMap);


// EARTHQUAKE DATA

// Earthquake Data Layer
let earthquakes = new L.layerGroup();

// Earthquake Data from USGS
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){
        // color ranges
        function dataColor(depth){
            if (depth > 90)
                return 'red';
            else if(depth > 70)
                return '#eb6b34';
            else if(depth > 50)
                return '#eb9c34';
            else if(depth > 30)
                return '#ebc934';
            else if(depth > 10)
                return '#cdeb34';
            else 
                return 'green';
        }

        // radius size
        function radiusSize(mag){
            if (mag == 0)
                return 1;
            else
                return mag * 5;
        }

        function dataStyle(feature)
        {
            return {
                opacity: 0.5, 
                fillOpacity: 0.5, 
                fillColor: dataColor(feature.geometry.coordinates[2]),
                color: "000000",
                radius: radiusSize(feature.properties.mag),
                weight: 0.5,
                stroke: true
            }
        }

        L.geoJson(earthquakeData, {
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            style: dataStyle,
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b> ${feature.properties.mag} </b><br>
                                Depth: <b> ${feature.geometry.coordinates[2]} </b><br>
                                Location: <b> ${feature.properties.place} </b><br>`);
            }
        }).addTo(earthquakes);
    }
);

// add layer
earthquakes.addTo(myMap);

// toggle
let toggle = {
    "Earthquakes": earthquakes
};

// map control
L.control.layers(basemaps, toggle,
    {
        collapsed: false,   
    }).addTo(myMap);



var legend = L.control({
    position: "bottomright",
    });

    legend.onAdd = function () {    
    var div = L.DomUtil.create("div", "info legend");
    console.log(div);
    
    var intervals = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "green",
      "#cdeb34",
      "#ebc934",
      "#eb9c34",
      "#eb6b34",
      "red",
    ];
    
    for (var i = 0; i < intervals.length; i++) {
      div.innerHTML +=
        "<i style='background: " +
        colors[i] +
        "'></i>" +
        intervals[i] +
        " to " +
        (intervals[i + 1] ? +intervals[i + 1] + "<br>" : " +"); 
    }
    
    return div;
    };

    // add the legend to the map
    legend.addTo(myMap);

