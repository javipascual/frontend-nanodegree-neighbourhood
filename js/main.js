function initializeMap() {

}

// Overall viewmodel for this screen, along with initial state
var LocationsViewModel = function() {

  var self = this;

  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(52.496673, 13.424570),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map(mapCanvas, mapOptions);


  this.search = function() {
  	if (this.itemToAdd() != "") {
  	   var term = this.itemToAdd();
  		 this.itemToAdd("");
  	}
  }

  // add markers to the map at the desired locations
  this.addLocationsMarkers = function(locations) {
  	var cont = document.getElementById('locationsList');

  	for (var i = 0; i < locations.length; i++) {
      var l = locations[i];
      l.isActive = ko.observable(false);
  		l.marker = new google.maps.Marker({
  			position: {lat: l.location.coordinate.latitude, lng:l.location.coordinate.longitude},
  			label: l.name,
  			map: this.map,
        parent: l
  		});

      l.marker.addListener('mouseover', function() {
        this.parent.isActive(true);
      });

      l.marker.addListener('mouseout', function() {
        this.parent.isActive(false);
      });
  	}
  }

  this.onMouseOver = function(location) {

  console.log(location.name + " ON")
       location.marker.setAnimation(google.maps.Animation.BOUNCE);
       location.isActive(true);

  }

  this.onMouseOut = function(location) {

  console.log(location.name + " OFF")
       location.marker.setAnimation(null);
location.isActive(false);
  }

  this.addLocationsMarkers(locs);


	this.items = ko.observableArray(locs);
	this.itemToAdd = ko.observable("");
}

ko.applyBindings(new LocationsViewModel());
