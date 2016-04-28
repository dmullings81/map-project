// Model

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

var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
}

// ViewModel

function viewModel() {
    var self = this;

    this.restaurantList = ko.observableArray([]);
//Code adapted from Ben Jaffe's CatClickers tutorial
    restaurants.forEach(function(restaurantItem){
        self.restaurantList.push( new  Restaurant(restaurantItem) );
    });



myFunction = function() {
    alert("hello world");
}

}

ko.applyBindings(new viewModel());







//Google Maps API

function initMap() {

            var kofu = new google.maps.LatLng(35.653296, 138.557487);

            var mapOptions = {
               center: kofu,
               zoom:14,
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),mapOptions);




                // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

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
        })(marker, i));
});
     }
// http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/

  function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


//         google.maps.event.addDomListener(window, 'load', loadMap);

// AIzaSyCr492h5nUEKHElF9GxEq_fie2z3c478nY

//var LocationList = '<li class="pure-menu-item" data-bind="text: title"></li>';

