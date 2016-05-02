// Model

//Info about each restaurant
var restaurants = [
  {
    name: "Hanedaya",
    lat: 35.641980,
    lng: 138.543689,
    soupType: "shoyu-tonkotsu"
  },
  {
    name: "Shoshi Kantentsu",
    lat: 35.652693,
    lng: 138.561918,
    soupType: "miso"
  },
  {
    name: "Nakai",
    lat: 35.642302,
    lng: 138.557425,
    soupType: "ebi"
  },
  {
    name: "Enja",
    lat: 35.648980,
    lng: 138.589937,
    soupType: "fish" //tonkotsu gyofun gyokai sakana
  },
  {
    name: "Zenjiro",
    lat: 35.645172,
    lng: 138.554717,
    soupType: "shoyu"
  },
  {
    name: "Daikokuya",
    lat: 35.647434,
    lng: 138.548888,
    soupType: "shoyu-tonkotsu"
  },
]

// Restaurant object
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.soupType = ko.observableArray(data.soupType);
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

//Google Maps API


            //hardcoded map location stored as variable in case of adding further locs in future.
            var kofu = new google.maps.LatLng(35.653296, 138.557487);

            var mapOptions = {
               center: kofu,
               zoom:14,
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),mapOptions);
/*  TODO:  Google maps error message
            setTimeout(function() {
  if(!google || !google.maps) {
    alert("Oops... Failed to reach Google Maps")
  }
}, 5000);*/



// http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
    // Display multiple markers on a map
    //var infoWindow = new google.maps.InfoWindow();

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
    //add marker for each restaurant
    restaurant.marker = new google.maps.Marker(markerOptions);
    // add listener to each marker
    google.maps.event.addListener(restaurant.marker, 'click', (function(marker) {
            return function() {
                toggleBounce(restaurant.marker);
                //infoWindow.setContent(restaurant.marker.title);
                //infoWindow.open(map, restaurant.marker);
                //map.panTo(restaurant.marker.position);
                //self.showInfoWindow(marker);
            }
        })(restaurant.marker));


// ************* infoWindow contents **************

//Create variables for use in contentString for infowindows
    var windowNames = restaurant.name;


    //Create new infowindow
    infoWindow = new google.maps.InfoWindow(
      {

    //maxWidth: 700
  });

    //Create event listener to open infowindow when marker is clicked
    google.maps.event.addListener(restaurant.marker, 'click', function() {
          //Create contentString variable for infowindows
          var contentString;
          var latitude = restaurant.lat;
          var longitude = restaurant.lng;
          //Instagram API request URL
          var instagramURL = "https://api.instagram.com/v1/media/search?lat=" + latitude + "&lng=" + longitude + "&distance=100&access_token=379669.1fb234f.9116b984edae498289e20991c57994c6"
          var instagramRequestTimeout = setTimeout(function(){
        failContent = '<div id="content">' + windowNames + '<p>' + 'Oops... Failed to reach Instagram'+ '</p>' + '</div>'
            infoWindow.setContent(failContent);
    }, 8000);

          $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: instagramURL,
      }).done(function(data) {
        if (data.data.length > 0) {
        // placing the images on the page
        for (var i = 0; i < 6; i++) {
          iWContent = '<div class="instagram-div"><p> ' + restaurant.name + '</p> <div class="insta-images"><a href="' +
          data.data[0].link + '"  target="_blank"><img src="' + data.data[0].images.low_resolution.url + '"></a><a href="' +
          data.data[1].link + '"  target="_blank"><img src="' + data.data[1].images.low_resolution.url + '"></a><a href="' +
          data.data[2].link + '"  target="_blank"><img src="' + data.data[2].images.low_resolution.url + '"></a><a href="' +
          data.data[3].link + '"  target="_blank"><img src="' + data.data[3].images.low_resolution.url + '"></a></div></div>';
          infoWindow.setContent(iWContent);
          //self.infoWindow().open(myPlaces.map, currentMarker);

          clearTimeout(instagramRequestTimeout);
                  console.log(data);
    }
  } else {
                iWContent = '<div id="content">' + windowNames + '<p>' + 'No pictures found on Instagram'+ '</p>' + '</div>'
                console.log(instagramURL);
                infoWindow.setContent(iWContent);
              }
        });

      ; //End Ajax request
      console.log("Restaurant Clicked On");

      infoWindow.open(map, this);

    }); //end click listener

// ***********************************************



  }); // end building markers

//make the marker bounce for a set duration
  function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 2100);
  }
}






























// ******** Filter funcionality **********

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
//to do - add
      if (restaurant.soupType.toLowerCase().indexOf(searchInput) !== -1) {
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

//Instagram API CLIENT ID dab20c62410d4e2abd752f80e27857f7
//CLIENT SECRET 220c6ea74e484c68a645067992a3c717

//Flickr Key 59a6bd8485cf47d8f550aff19d19386e
// Secret 2459fbbf2fe176e0


