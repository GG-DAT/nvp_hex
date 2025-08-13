function toggleInfo() {
  var x = document.getElementById("info");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
    document.getElementById("legend-window").style.display = "none";
  }
}

function toggleLegend() {
  var x = document.getElementById("legend-window");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
    document.getElementById("info").style.display = "none";
  }
}

// document.getElementById('toggleBuildings').addEventListener('click', function () {
//   var buildingVisibility = map.getLayoutProperty('buildings', 'visibility');

//   if (buildingVisibility === 'visible') {
//     map.setLayoutProperty('buildings', 'visibility', 'none');
//   } else {
//     map.setLayoutProperty('buildings', 'visibility', 'visible');
//   }
// });

mapboxgl.accessToken = MAPBOX_TOKEN;
var map = new mapboxgl.Map({
  container: 'map',
  style: MAPBOX_STYLE,
  center: [5.122288,52.090321],
  zoom: 16,
  maxZoom: 21,
  minZoom: 16,
 // maxBounds: [
   // [-70.99, 42.40], // Southwest coordinates
   // [-71.11, 42.20] // Northeast coordinates
 // ],
  hash: true
});

map.addControl(new mapboxgl.NavigationControl());


map.on('load', function() {

  //   console.log(map.getStyle().layers.map(layer => layer.id));

  // const buildingsLayerId = '3d-building'; // ID of the layer to toggle

  // // Toggle button event listener
  // document.getElementById('toggleBuildings').addEventListener('click', function() {
  //   const visibility = map.getLayoutProperty(buildingsLayerId, 'visibility');

  //   if (visibility === 'visible') {
  //     map.setLayoutProperty(buildingsLayerId, 'visibility', 'none');
  //   } else {
  //     map.setLayoutProperty(buildingsLayerId, 'visibility', 'visible');
  //   }
  // });



  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;
  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      labelLayerId = layers[i].id;
      break;
    }
  }

 map.addSource('hexs', {
     type: 'vector',
     url: HEX_TILESET
  });
  var fillColor = ["step", ["get", 'speed']];
  for (var i = 0; i < GROUPS.length; i++) {
    if (i == 0) fillColor.push(GROUPS[0].color)
    else fillColor.push(GROUPS[i].value, GROUPS[i].color)
  }

  map.addLayer({
    'id': 'hexs',
    'type': 'fill', // Change here to 'fill'
    'source': 'hexs',
    'source-layer': HEX_LAYER,
    'paint': {
      'fill-color': fillColor, // Change here to 'fill-color'
      'fill-opacity': 0.75 // Set desired opacity
    },
    'filter': ['has', 'speed'] 

  },
  labelLayerId
  );
  // The rest of your code remains unchanged
  // map.addLayer(
  //   {
  //     'id': '3d-buildings',
  //     'source': 'composite',
  //     'source-layer': 'building',
  //     'filter': ['==', 'extrude', 'true'],
  //     'type': 'fill-extrusion',
  //     'minzoom': 15,
  //     'paint': {
  //     'fill-extrusion-color': '#141c26',
  //     'fill-extrusion-height': [
  //       'interpolate',
  //       ['linear'],
  //       ['zoom'],
  //       15, 0,
  //       15.05, ['get', 'height']
  //     ],
  //     'fill-extrusion-base': [
  //       'interpolate',
  //       ['linear'],
  //       ['zoom'],
  //       15, 0,
  //       15.05, ['get', 'min_height']
  //     ],
  //     'fill-extrusion-opacity': [
  //       'interpolate',
  //       ['linear'],
  //       ['zoom'],
  //       15, 0,
  //       16, 0.95
  //     ]
  //   }
  // },
  // labelLayerId
  // );


     map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'properties': {
                'description': '<strong>Place Name</strong><p>Description text goes here.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [5.1151301, 52.0916494] // example coordinates [lng, lat]
              }
            }
            // You can add more features here
          ]
        }
      });

  // map.addLayer({
  //   'id': 'points-layer',
  //   'type': 'circle',
  //   'source': 'points',
  //   'paint': {
  //     'circle-radius': 18,
  //     'circle-color': [
  //       'case',
  //       ['boolean', ['feature-state', 'hover'], false],
  //       '#FFCC00', // Hover color
  //       '#B42222'  // Default color
  //     ]
  //   }
  // });

  // Add the symbol layer for the icon
  // map.addLayer({
  //   'id': 'points-icon-layer',
  //   'type': 'symbol',
  //   'source': 'points',
  //   'layout': {
  //     'icon-image': '', 
  //     'icon-size': 0.8
  //   }
  // });

        // Create a popup, but don't add it to the map yet
  var filters = [];

  function filterhexs(index) {

    if (filters[index].active == false) {
      filters[index].active = true;
    }
    else {
      filters[index].active = false;
    }

    var conditions = ['any'];

    for (var i = 0; i < filters.length; i++) {
      if (filters[i].active == true)
        conditions.push(filters[i].condition);
    }
    console.log(conditions)
    map.setFilter('hexs', conditions);
  }

  function getMaxValue(groups) {
    maxValue = 0.0
    for (var i=0; i<groups.length; i++) {
      console.log(groups[i].value, maxValue)
      if (groups[i].value > maxValue) {
        maxValue = groups[i].value
      }
    }
    return maxValue
  }

  // add a legend item
  function addLegendItem(item, index) {

    if (GROUPS[index - 1] == null) {
      var low = item.value
      var high = Infinity
      var string = low + UNITS + '+'
    }

    else {
      if (item.value == 0)
        var low = 0
      else
        var low = item.value

      var high = GROUPS[index - 1].value - PRECISION
      var string = low + ' - ' + high + UNITS
    }

    filters.push({'condition': ['all',['>', 'width', low],['<=', 'width', high]], 'active': false})

    var row = document.createElement("LI");
    var rowContent = document.createElement("DIV");
    var rowLeft = document.createElement("DIV");
    var color = document.createElement("DIV");
    // var rowRight = document.createElement("DIV");

    rowLeft.innerHTML = "<p>" + item.rating + ' ' + UNITS + "</p>"
    rowLeft.classList.add("row-left");
    color.classList.add("color");
    color.setAttribute("style", "background:" + item.color + ";");
    rowLeft.appendChild(color)
    row.appendChild(rowLeft)
    // rowRight.classList.add("row-right");
    // rowRight.innerHTML = "<p>" + string + "</p>";
    // row.appendChild(rowRight);
    document.getElementById("legend-main").appendChild(row);
  }

  GROUPS.forEach(addLegendItem);
  GROUPS

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  var popup_poi = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  function addPopup(e) {
    var speed = e.features[0].properties.speed;

    // if (speed === null | speed < 0.5) {
    // return; // Exit the function if speed is null
    // }

    map.getCanvas().style.cursor = 'pointer';

    var speed = e.features[0].properties.speed
    var lineColor = e.features[0].layer.paint['line-color']
    var coordinates = e.lngLat;
    var stopIndex;

    for (i=0; i < GROUPS.length; i++) {
      if (GROUPS[i + 1] == null) {
        if (speed >= GROUPS[i].value) {
          groupIndex = i;
        }
      } else {
        if (speed >= GROUPS[i].value && speed < GROUPS[i + 1].value) {
          groupIndex = i;
        }
      }
    }

    lineColor = GROUPS[groupIndex].color

    var description =
      '<div class="name">Speed:</div>' +
      '<div class="width">' + Math.round(speed * 10) / 10 + ' ' + UNITS + '</div>'

    popup.setLngLat(coordinates)
    popup.setHTML(description)
    popup.addTo(map)

    popup._content.style.color = lineColor
    popup._content.style.borderColor = lineColor

    if (popup._tip.offsetParent.className.includes('mapboxgl-popup-anchor-bottom')) {
      popup._tip.style.borderTopColor = lineColor
    }
    if (popup._tip.offsetParent.className.includes('mapboxgl-popup-anchor-top')) {
      popup._tip.style.borderBottomColor = lineColor
    }
    if (popup._tip.offsetParent.className.includes('mapboxgl-popup-anchor-right')) {
      popup._tip.style.borderLeftColor = lineColor
    }
    if (popup._tip.offsetParent.className.includes('mapboxgl-popup-anchor-left')) {
      popup._tip.style.borderRightColor = lineColor
    }

    popup.addTo(map)
  }

  map.on('touchstart', 'hexs', function(e) {
    addPopup(e);
  })

  map.on('mousemove', 'hexs', function(e) {
    if (!map.queryRenderedFeatures(e.point, { layers: ['points-layer'] }).length) {
        addPopup(e);
    }   
  });

  map.on('mouseleave', 'hexs', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  map.on('mouseenter', 'points-layer', function(e) {
        popup.remove();
  });




   map.on('click', 'points-layer', function(e) {
    // Prevent click-through to other layers

    popup.remove();
    e.preventDefault();

    // Get the description and image for the clicked feature
    const description = e.features[0].properties.description;
    const image = e.features[0].properties.image;

    // Set the content of the pop-up
    popup_poi.setLngLat(e.lngLat)
         .setHTML(`<p>this works</p>`
          //  `<div>
          //     <img src="${image}" alt="${description}" style="width:150px;height:auto;"/>
          //     <p>${description}</p>
          //   </div>`
         )
         .addTo(map);
  });

        // Remove hover state on mouseleave
  map.on('mouseleave', 'points-layer', function() {

        map.getCanvas().style.cursor = '';
        popup_poi.remove();
  });
});


