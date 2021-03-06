'use strict';

var initApp = function() {
  ko.applyBindings(new LocationsViewModel());
};

var LocationsViewModel = function() {

  var self = this;

  var mapCanvas = document.getElementById('map'),
      zoom = (window.innerHeight < 500 || window.innerWidth < 500) ? 12 : 13,
      mapOptions = {
        center: new google.maps.LatLng(52.496673, 13.424570),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

  this.map = new google.maps.Map(mapCanvas, mapOptions);
  this.items = ko.observableArray([]);
  this.filterTerm = ko.observable("");
  this.infoWindow = new google.maps.InfoWindow({
    content: "<div id=infowindow></div>"
  });

  // retrieves the list of the venues in the area
  this.retrieveLocations = function() {

    var requestTimeout = setTimeout(function() {
      self.infoWindow.setContent("Error! failed to get locations");
      self.infoWindow.open(self.map, location.marker);
    }, 3000);

    var parameters = {
      client_id: "OQDK0BHM4AQA3G2DAZTN3ZUUMNRJX4RG2XQHN5WJKF0TUMCT",
      client_secret: "G0M3ZFUVZOCD1I3P2CMGT4KFFBYK5ZG5TC5EGLVJK3U2RRC0",
      v: "20130815",
      ll: "52.496673,13.424570",
      limit: 50,
      categoryId: "4bf58dd8d48988d1d3941735", // veggie restaurants
    };

    var settings = {
      url: "https://api.foursquare.com/v2/venues/search",
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      success: function(results) {

        clearTimeout(requestTimeout);

        var locations = results.response.venues;
        self.addLocationsMarkers(locations);

        for (var i = 0; i < locations.length; i++)
          self.items.push(locations[i]);

        self.filteredItems = self.items;
      },
    };

    $.ajax(settings);
  };

  // call to the funtion
  this.retrieveLocations();

  // retrieves specific information for a location
  this.generateLocationContent = function(location) {

    var requestTimeout = setTimeout(function() {
      self.infoWindow.setContent("Error! failed to get location data");
      self.infoWindow.open(self.map, location.marker);
    }, 3000);

    var parameters = {
      client_id: "OQDK0BHM4AQA3G2DAZTN3ZUUMNRJX4RG2XQHN5WJKF0TUMCT",
      client_secret: "G0M3ZFUVZOCD1I3P2CMGT4KFFBYK5ZG5TC5EGLVJK3U2RRC0",
      v: "20130815",
      ll: "52.496673,13.424570",
    };

    var settings = {
      url: "https://api.foursquare.com/v2/venues/" + location.id,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      success: function(results) {

        clearTimeout(requestTimeout);

        var cats = results.response.venue.categories.map(function(a) {
          return a.name;
        }).join();
        var url = results.response.venue.url;
        var price = results.response.venue.attributes.groups[0] ? results.response.venue.attributes.groups[0].summary : "-";

        var txt = "<div>";
        txt += "<span class='name'>" + results.response.venue.name + "</name>";
        if (url) txt += "<span class='url'>" + url + "</span>";
        txt += "<span class='cats'>" + cats + "</span>";
        txt += "<span class='price'>" + price + "</span>";
        txt += "</div>";
        self.infoWindow.setContent(txt);
        self.infoWindow.open(self.map, location.marker);

        clearTimeout(requestTimeout);
      },
    };

    $.ajax(settings);
  };

  // add markers to the map at the desired locations
  this.addLocationsMarkers = function(locations) {

    // markers mouse events callbacks
    var mouseOverCallback = function() {
      this.parent.isActive(true);
    };

    var mouseOutCallback = function() {
      this.parent.isActive(false);
    };

    var mouseClickCallback = function() {
      this.setAnimation(google.maps.Animation.BOUNCE);
      var that = this;
      setTimeout(function() {
        that.setAnimation(null);
      }, 1500);
      self.generateLocationContent(this.parent);
    };

    // create a marker for each location
    for (var i = 0; i < locations.length; i++) {
      var l = locations[i];
      l.isActive = ko.observable(false);
      l.marker = new google.maps.Marker({
        position: {
          lat: l.location.lat,
          lng: l.location.lng
        },
        map: this.map,
        parent: l
      });

      l.marker.addListener('mouseover', mouseOverCallback);
      l.marker.addListener('mouseout', mouseOutCallback);
      l.marker.addListener('click', mouseClickCallback);
    }
  };

  // mouse events on the locations list
  this.onMouseOver = function(location) {
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      location.marker.setAnimation(null);
    }, 1500);
    location.isActive(true);
  };

  this.onMouseOut = function(location) {
    location.isActive(false);
    location.marker.setAnimation(null);
  };

  this.onClick = function(location) {
    location.marker.setAnimation(null);
    self.generateLocationContent(location);
  };

  // filter the items using the text in the filter box
  this.filteredItems = ko.computed(function() {
    var filter = self.filterTerm().toLowerCase();
    if (!filter) {
      ko.utils.arrayForEach(self.items(), function(item) {
        item.marker.setVisible(true);
      });
      return self.items();
    }
    else {
      return ko.utils.arrayFilter(self.items(), function(item) {
        var visible = (item.name.toLowerCase().indexOf(filter) === 0);
        item.marker.setVisible(visible);
        return visible;
      });
    }
  }, this);
};
