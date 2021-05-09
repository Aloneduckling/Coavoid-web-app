mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", 
  style: "mapbox://styles/mapbox/streets-v11", 
  center: place.coordinates,
  zoom: 15, 
});

new mapboxgl.Marker()
.setLngLat(place.coordinates)
.addTo(map);

