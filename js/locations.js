var locations = [
{
	name: 'Villa di Wow',
	address: { lat: 52.495349, lng:13.429851 }
},
{
	name: 'Chaparro',
	address: { lat: 52.498267, lng: 13.428859 }
},
{
	name: 'Yellow Sunshine',
	address: { lat: 52.497604, lng: 13.430678 }
},
];

// add markers to the map at the desired locations
function addLocations(map, locations) {
  for (var i = 1; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].address,
      label: locations[i].name,
      map: map
    });
  }
}
