function initializeMap() {

}

// Overall viewmodel for this screen, along with initial state
var LocationsViewModel = function() {

  items = [];
  for (var i = 0; i < locs.length; i++)
    items.push(locs[i].name);

	 this.items = ko.observableArray(items);
	 this.itemToAdd = ko.observable("");

	 var mapCanvas = document.getElementById('map');
   var mapOptions = {
     center: new google.maps.LatLng(52.496673, 13.424570),
     zoom: 14,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   this.map = new google.maps.Map(mapCanvas, mapOptions);
   this.addLocationsMarkers(locs);
}

LocationsViewModel.prototype.search = function() {
	if (this.itemToAdd() != "") {

			var mapBounds = this.map.getBounds();
			var URL = "https://api.foursquare.com/v2/venues/search?client_id=CLIENT_ID"
					  "&client_secret=CLIENT_SECRET" +
					  "&v=20130815" +
					  "&ll=52.496673, 13.424570" +
					  "&query=sushi";

			var URL = "http://api.yelp.com/v2/search?term=" + this.itemToAdd() +
					 "&bounds=" + mapBounds.getSouthWest().lat() +
					 "," + mapBounds.getSouthWest().lng() +
					 "," + mapBounds.getNorthEast().lat() +
					 "," + mapBounds.getNorthEast().lng() +
					 "oauth_consumer_key=scl6Z7MTtfGd43flrc742Q";

			console.log(URL)

			 var eURL = encodeURI(URL);

			 this.itemToAdd("");
	}
}

// add markers to the map at the desired locations
LocationsViewModel.prototype.addLocationsMarkers = function(locations) {
	var cont = document.getElementById('locationsList');

	for (var i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
			position: {lat: locations[i].location.coordinate.latitude, lng: locations[i].location.coordinate.longitude},
			label: locations[i].name,
			map: this.map
		});
	}
}

LocationsViewModel.prototype.onClick = function(location) {
	console.log("click");
}

ko.applyBindings(new LocationsViewModel());
