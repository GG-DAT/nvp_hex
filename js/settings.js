var MAPBOX_TOKEN = 'pk.eyJ1IjoiZnRhbGxpcyIsImEiOiJjbWUzYWkwZDAwNHp5MmpzOXgzazdkdzUyIn0.RtMvhtAAxQDGZqrg-2Cc_g'
var MAPBOX_STYLE = 'mapbox://styles/ftallis/cme4gev6m00ps01sc66e3327k'
var HEX_TILESET = 'mapbox://ftallis.624ik2sk' 
var HEX_LAYER = 'Utrecht_Binnenstad_Hex14_v2-0krx04' 
var UNITS = 'km/hr' // change to 'm' for meters
var PRECISION = 0.1 // the number of decimal places
var GROUPS = [
  {
    "value": 0.5040,
    "rating": "0.5 - 1",
    "color": "#30123b"
  },
  {
    "value": 1.0040,
    "rating": "1 - 1.5",
    "color": "#434fbc"
  },
  {
    "value": 1.5040,
    "rating": "1.5 - 2",
    "color": "#4686fb"
  },
  {
    "value": 2.0040,
    "rating": "2 - 2.5",
    "color": "#28bceb"
  },
  {
    "value": 2.5040,
    "rating": "2.5 - 3",
    "color": "#1be5b5"
  },
  {
    "value": 3.0040,
    "rating": "3 - 3.5",
    "color": "#58fb74"
  },
  {
    "value": 3.5040,
    "rating": "3.5 - 4",
    "color": "#a4fc3c"
  },
  {
    "value": 4.0040,
    "rating": "4 - 4.5",
    "color": "#dae336"
  },
  {
    "value": 4.5040,
    "rating": "4.5 - 5",
    "color": "#fbb938"
  },
  {
    "value": 5.0040,
    "rating": "5 - 5.5",
    "color": "#fb7e21"
  },
  {
    "value": 5.5040,
    "rating": "5.5 - 6",
    "color": "#e3440a"
  },
  {
    "value": 6.0040,
    "rating": "6 - 6.5",
    "color": "#b81d02"
  },
  {
    "value": 6.5040,
    "rating": "6.5 - 7",
    "color": "#7a0403"
  }
]