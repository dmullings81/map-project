// Model

//Info about each restaurant
var restaurants = [
  {
    name: "Hanedaya",
    lat: 35.641980,
    lng: 138.543689,
    type: ["shoyu-tonkotsu"]
  },
  {
    name: "Shoshi Kantentsu",
    lat: 35.652693,
    lng: 138.561918,
    type: ["miso"]
  },
  {
    name: "Nakai",
    lat: 35.642302,
    lng: 138.557425,
    type: ["ebi"]
  },
  {
    name: "Enja",
    lat: 35.648980,
    lng: 138.589937,
    type: ["fish"]
  },
  {
    name: "Zenjiro",
    lat: 35.645172,
    lng: 138.554717,
    type: ["shoyu", "tantanmen", "miso"]
  },
  {
    name: "Daikokuya",
    lat: 35.647434,
    lng: 138.548888,
    type: ["shoyu-tonkotsu"]
  },
]

// Restaurant object
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.type = ko.observableArray(data.type);
}

  //Global variables
    var map;
    var infoWindow;
    var marker;

// **** ViewModel ****

//held inside initMap as this is what the API is calling back to. Change later?
function initMap() {

var viewModel = function () {

    var self = this;

    //Store list of restaurants in observableArray to easily bind using ko.
      self.restaurantList = ko.observableArray(restaurants);


//Put the restaurant data into the array. Using Udacity's JavaScript Design Patterns CatClickers tutorial
    /*restaurants.forEach(function(restaurantItem){
        self.restaurantList.push( new  Restaurant(restaurantItem) );
    });*/


    myFunction = function() {
        alert("hello world");
    }


//Google Maps API


            //hardcoded map location stored as variable in case of adding further locs in future.
            var kofu = new google.maps.LatLng(35.653296, 138.557487);

            var mapOptions = {
               center: kofu,
               zoom:14,
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),mapOptions);



// http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker;
/*
    // Loop through our array of markers & place each one on the map
    //should loop through observable array?
    self.restaurantList().forEach(function(restaurant){
        var position = new google.maps.LatLng(restaurant.lat, restaurant.lng);
        //bounds.extend(position);
        restaurant.marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: restaurant.name,
    });

        google.maps.event.addListener(restaurant.marker, 'click', (function(marker) {
            return function() {
                toggleBounce(restaurant.marker);
                infoWindow.setContent(restaurant.marker.title);
                infoWindow.open(map, restaurant.marker);
                map.panTo(restaurant.marker.position)
            }
        })(restaurant.marker));
}); */
//*********************************

// Build Markers via the Maps API and place them on the map.
  self.restaurantList().forEach(function(restaurant) {
    var position = new google.maps.LatLng(restaurant.lat, restaurant.lng);
    var markerOptions = {
      map: map,
      position: position,
      animation: google.maps.Animation.DROP,
      title: restaurant.name
    };

    restaurant.marker = new google.maps.Marker(markerOptions);

    google.maps.event.addListener(restaurant.marker, 'click', (function(marker) {
            return function() {
                toggleBounce(restaurant.marker);
                infoWindow.setContent(restaurant.marker.title);
                infoWindow.open(map, restaurant.marker);
                map.panTo(restaurant.marker.position)
            }
        })(restaurant.marker));
  });

// ***********************************************

//make the marker bounce for a set duration
  function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 2900);
  }
}

    //infoWindow bound to the list items
    self.showWindows = function(restaurant) { //this recognizes GeoCoding and AJAX
        //console.log(placeItem);
        google.maps.event.trigger(restaurant.marker, 'click')
    }



//array contains all markers currently visible, as they can be filtered out
//technique from http://codepen.io/prather-mcs/pen/KpjbNN?editors=001

self.visibleRestaurants = ko.observableArray([]);

self.restaurantList().forEach(function(restaurant) {
  self.visibleRestaurants.push(restaurant);
});




  // This, along with the data-bind on the <input> element, lets KO keep
  // constant awareness of what the user has entered. It stores the user's
  // input at all times.
  self.userInput = ko.observable('');






  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visibleRestaurants.removeAll();

    // This looks at the name of each restaurant and then determines if the user
    // input can be found within the restaurant name.
    self.restaurantList().forEach(function(restaurant) {
      restaurant.marker.setVisible(false);

      if (restaurant.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.visibleRestaurants.push(restaurant);
      }
    });


    self.visibleRestaurants().forEach(function(restaurant) {
      restaurant.marker.setVisible(true);
    });
  };

}

ko.applyBindings(new viewModel());
}



// End ViewModel










//Google API key AIzaSyCr492h5nUEKHElF9GxEq_fie2z3c478nY
//End Google Maps API


