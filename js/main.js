var initApp = function() {
  ko.applyBindings(new LocationsViewModel())
}

var LocationsViewModel = function() {

  var self = this;

  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(52.496673, 13.424570),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map(mapCanvas, mapOptions);
  this.items = ko.observableArray([]);
  this.filterTerm = ko.observable("");
  this.infoWindow = new google.maps.InfoWindow({content: "<div id=infowindow></div>"});

  this.generateContentString = function(location) {

    var parameters = {
      client_id: "OQDK0BHM4AQA3G2DAZTN3ZUUMNRJX4RG2XQHN5WJKF0TUMCT",
      client_secret:"G0M3ZFUVZOCD1I3P2CMGT4KFFBYK5ZG5TC5EGLVJK3U2RRC0",
      v:"20130815",
      ll:"52.496673,13.424570"
    };

    var settings =  {
      url: "https://api.foursquare.com/v2/venues/" + location.id,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      success: function(results) {

        var cats = results.response.venue.categories.map(function(a) {return a.name;}).join();
        var url = results.response.venue.url;
        var price = results.response.venue.attributes.groups[0].summary;

        var txt = "<div>";
        txt += "<span class='name'>" + results.response.venue.name + "</name>";
        if (url) txt += "<span class='url'>" + url + "</span>";
        txt += "<span class='cats'>" + cats + "</span>";
        txt += "<span class='price'>" + price + "</span>";
        txt += "</div>";
        self.infoWindow.setContent(txt);
        self.infoWindow.open(self.map, location.marker);
      },
      error: function() {
        alert("Request failed");
      }
    }

    $.ajax(settings);
  }

  this.retrieveLocations = function() {

    var parameters = {
      client_id: "OQDK0BHM4AQA3G2DAZTN3ZUUMNRJX4RG2XQHN5WJKF0TUMCT",
      client_secret:"G0M3ZFUVZOCD1I3P2CMGT4KFFBYK5ZG5TC5EGLVJK3U2RRC0",
      v:"20130815",
      ll:"52.496673,13.424570",
      query:"vegan&restaurant"
    };

    var settings =  {
      url: "https://api.foursquare.com/v2/venues/search",
  	  data: parameters,
  	  cache: true,
  	  dataType: 'jsonp',
  	  success: function(results) {
                  var locations = results.response.venues;
                  self.addLocationsMarkers(locations);
                  for (var i = 0; i < locations.length; i++)
                	   self.items.push(locations[i]);
                  self.filteredItems = self.items;
              },
  	  error: function() {
        alert("Could not retrieve locations list!");
      }
    }

    $.ajax(settings);
  }

  this.retrieveLocations();

  this.filter = function() {
  	if (this.filterTerm() != "") {
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
  			position: {lat: l.location.lat, lng:l.location.lng},
  			label: l.name,
  			map: this.map,
        parent: l
  		});

      l.marker.addListener('mouseover', function() {
        this.parent.isActive(true);
      });

      l.marker.addListener('mouseout', function() {
        this.parent.isActive(false);
        this.setAnimation(null);
      });

      l.marker.addListener('click', function() {
        this.setAnimation(google.maps.Animation.BOUNCE);
        self.generateContentString(this.parent);
      });
  	}
  }

  this.onMouseOver = function(location) {
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    location.isActive(true);
    self.generateContentString(location);
  }

  this.onMouseOut = function(location) {
    location.marker.setAnimation(null);
    location.isActive(false);
  }


  // filter the items using the filter text
  this.filteredItems = ko.computed(function() {
    var filter = self.filterTerm().toLowerCase();
    if (!filter) {
      ko.utils.arrayForEach(self.items(), function(item) {
        item.marker.setVisible(true);
      });
      return self.items();
    } else {
        return ko.utils.arrayFilter(self.items(), function(item) {
            const visible = (item.name.toLowerCase().indexOf(filter) === 0);
            item.marker.setVisible(visible);
            return visible;
        });
    }
  }, this);
}
