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


  this.filter = function() {
  	if (this.filterTerm() != "") {
      console.log(this.filterTerm())
  	   var term = this.filterTerm();
  		 this.filterTerm("");
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
    location.marker.setAnimation(null);
    location.isActive(false);
  }

  this.addLocationsMarkers(locs);

	this.items = ko.observableArray(locs);
	this.filterTerm = ko.observable("");

  // filter the items using the filter text
  this.filteredItems = ko.computed(function() {
    var filter = this.filterTerm().toLowerCase();
    if (!filter) {
      ko.utils.arrayForEach(this.items(), function(item) {
        item.marker.setVisible(true);
      });
      return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            const visible = (item.name.toLowerCase().indexOf(filter) === 0);
            item.marker.setVisible(visible);
            return visible;
        });
    }
  }, this);
}

ko.applyBindings(new LocationsViewModel());
