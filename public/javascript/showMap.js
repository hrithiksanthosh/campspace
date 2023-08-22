// Initialize the map
function initMap() {
  var mapElement = document.getElementById("map");

  // Get the location data from the map container attributes
  var latitude = parseFloat(mapElement.getAttribute("data-latitude"));
  var longitude = parseFloat(mapElement.getAttribute("data-longitude"));

  // Create a new map instance
  var map = new google.maps.Map(mapElement, {
    center: { lat: latitude, lng: longitude },
    zoom: 13, // Adjust the initial zoom level as needed
  });

  // Add a marker for the location
  new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
  });
}

// Load the Google Maps API with your API key
function loadGoogleMapsScript() {
  var apiKey = g_Key; // Replace YOUR_API_KEY with your actual API key
  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    apiKey +
    "&callback=initMap";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// Call the loadGoogleMapsScript function after the page has loaded
window.onload = loadGoogleMapsScript;
