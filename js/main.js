var locations = [
{
	name: 'Let it Be',
	address: { lat: 52.479189, lng: 13.448940 }
},
{
	name: 'Yellow Sunshine',
	address: { lat: 52.497604, lng: 13.430678 }
},
{
	name: 'Heat & Beat',
	address: { lat: 52.484555, lng: 13.434898 }
},
{
	name: 'Lili Burger',
	address: { lat: 52.488724, lng: 13.422633 }
},
{
	name: 'Pele Mele',
	address: { lat: 52.479519, lng: 13.441749 }
},
];

// add markers to the map at the desired locations
function addLocations(map, locations) {
  var cont = document.getElementById('locationsList');

  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      position: locations[i].address,
      label: locations[i].name,
      map: map
    });

    var elem = document.createElement('li');
    elem.innerHTML = locations[i].name;
    cont.appendChild(elem);
  }
}

function initializeMap() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(52.496673, 13.424570),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  addLocations(map, locations);
}

// Overall viewmodel for this screen, along with initial state
function LocationsViewModel() {
}

ko.applyBindings(new LocationsViewModel());
