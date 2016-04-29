// Model

//Info about each restaurant
var restaurants = [
  {
    name: "Hanedaya",
    lat: 35.641980,
    lng: 138.543689
  },
  {
    name: "Shoshi Kantentsu",
    lat: 35.652693,
    lng: 138.561918
  },
  {
    name: "Nakai",
    lat: 35.642302,
    lng: 138.557425
  },
  {
    name: "Enja",
    lat: 35.648980,
    lng: 138.589937
  },
  {
    name: "Zenjiro",
    lat: 35.645172,
    lng: 138.554717
  },
  {
    name: "Daikokuya",
    lat: 35.647434,
    lng: 138.548888
  },
]

// Restaurant object
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
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
      this.restaurantList = ko.observableArray([]);
//Using Udacity's JavaScript Design Patterns CatClickers tutorial
    restaurants.forEach(function(restaurantItem){
        self.restaurantList.push( new  Restaurant(restaurantItem) );
    });

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




    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker;

    // Loop through our array of markers & place each one on the map
    //should loop through observable array?
    restaurants.forEach(function(restaurantItem){
        var position = new google.maps.LatLng(restaurantItem.lat, restaurantItem.lng);
        //bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: restaurantItem.name
    });

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                toggleBounce(marker);
                infoWindow.setContent(marker.title);
                infoWindow.open(map, marker);
                map.panTo(marker.position)
            }
        })(marker));
});

  function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 2800);
  }
}



}

ko.applyBindings(new viewModel());
}



// End ViewModel






// http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/



//Google API key AIzaSyCr492h5nUEKHElF9GxEq_fie2z3c478nY
//End Google Maps API


