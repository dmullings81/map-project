/*-------------------------------------------------------------------------
   * @description Interactive Neighborhood Map for Udacity's FEND Nanodegree
   *
   * @author Dimitris Mullings
   *
   * @dependencies
   *  - knockout-3.4.0.js
   *  - jquery.min.js
   *-------------------------------------------------------------------------/

/** Model **/
/** Info about each restaurant
TODO: Add more restaurants **/
var restaurants = [{
    name: "Hanedaya",
    lat: 35.641980,
    lng: 138.543689,
    soupType: "shoyu-tonkotsu"
}, {
    name: "Shoshikantentsu",
    lat: 35.652693,
    lng: 138.561918,
    soupType: "miso"
}, {
    name: "Nakai",
    lat: 35.642302,
    lng: 138.557425,
    soupType: "ebi"
}, {
    name: "Enja",
    lat: 35.648980,
    lng: 138.589937,
    soupType: "tonkotsu-gyokai"
}, {
    name: "Zenjiro",
    lat: 35.645172,
    lng: 138.554717,
    soupType: "shoyu"
}, {
    name: "Daikokuya",
    lat: 35.647434,
    lng: 138.548888,
    soupType: "shoyu-tonkotsu"
}, {
    name: "Menmaru",
    lat: 35.636431,
    lng: 138.584119,
    soupType: "shoyu"
}, {
    name: "Maruminamoto",
    lat: 35.647642,
    lng: 138.567520,
    soupType: "miso"
}, {
    name: "Nagata",
    lat: 35.646761,
    lng: 138.539823,
    soupType: "shio"
}, {
    name: "Sennari",
    lat: 35.651858,
    lng: 138.541043,
    soupType: "shio"
}];

/** Restaurant object **/
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.soupType = ko.observableArray(data.soupType);
};

/** ViewModel **/

/** Held inside initMap as this is what the API is calling back to.
TODO: Remove this later? **/
function initMap() {

    /** Check if the map loaded, if not an error message appears appears
    Used guide here https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282 **/

    if (typeof google === 'undefined') {
        googleError();
    }

    var viewModel = function() {
        var self = this;

        /** Store list of restaurants in observableArray to easily bind using ko. **/
        self.restaurantList = ko.observableArray(restaurants);

        /*Alternative way to put the restaurant data into the array.
        Using Udacity's JavaScript Design Patterns CatClickers tutorial. **/
        /** restaurants.forEach(function(restaurantItem){
        	self.restaurantList.push( new  Restaurant(restaurantItem) );
        }); **/

        /** Array containing only unique soup types, for use in the datalist filter.
        http://stackoverflow.com/questions/13359534/unique-items-from-an-observablearray-of-object-properties **/
        self.uniqueSoupTypes = ko.dependentObservable(function() {
            var types = ko.utils.arrayMap(self.restaurantList(), function(item) {
                return item.soupType;
            });
            return ko.utils.arrayGetDistinctValues(types).sort();
        });

        /** Hardcoded map location stored as variable in case of adding further locs in future. **/
        var kofu = new google.maps.LatLng(35.653296, 138.557487);
        var mapOptions = {
            center: kofu,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        /** Build markers via the Maps API and place them on the map.
        http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ **/
        self.restaurantList().forEach(function(restaurant) {
            var position = new google.maps.LatLng(restaurant.lat, restaurant.lng);
            var markerOptions = {
                map: map,
                position: position,
                animation: google.maps.Animation.DROP,
                title: restaurant.name
            };

            /** Add marker for each restaurant **/
            restaurant.marker = new google.maps.Marker(markerOptions);

            /** infoWindow contents **/

            /** Create new infowindow **/
            infoWindow = new google.maps.InfoWindow();

            /** Create event listener to open infowindow when marker is clicked **/
            google.maps.event.addListener(restaurant.marker, 'click', function() {

                /** Create variables for use in infowindow strings **/
                var iWContent;
                var failContent;
                var latitude = restaurant.lat;
                var longitude = restaurant.lng;
                var restaurantName = restaurant.name;
                var restaurantType = restaurant.soupType;
                /** Instagram API request URL **/
                var instagramURL = "https://api.instagram.com/v1/media/search?lat=" + latitude + "&lng=" + longitude + "&distance=100&access_token=379669.dab20c6.b7aca1b877cf490d810f98f515b46dda";
                /** Error handling in case of API failing **/
                var instagramRequestTimeout = setTimeout(function() {
                    failContent = '<div id="content">' + restaurantName + '<p>' + 'Oops... Failed to reach Instagram' + '</p>' + '</div>';
                    infoWindow.setContent(failContent);
                }, 8000);
                /** API call to Instagram **/
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: false,
                    url: instagramURL,
                }).done(function(data) {
                    if (data.data.length > 0) {
                        /** Places the images returned from Instagram **/
                        for (var i = 0; i < 6; i++) {
                            iWContent = '<div class="instagram-div"><h2> ' + restaurantName + '</h2><p><i> ' + restaurantType + '  soup base</i></p> <div class="insta-images"><a href="' +
                                data.data[0].link + '"  target="_blank"><img src="' + data.data[0].images.low_resolution.url + '"></a><a href="' +
                                data.data[1].link + '"  target="_blank"><img src="' + data.data[1].images.low_resolution.url + '"></a><a href="' +
                                data.data[2].link + '"  target="_blank"><img src="' + data.data[2].images.low_resolution.url + '"></a></div><p><i>Images from Instagram</i></p></div>';
                            infoWindow.setContent(iWContent);
                            /** Stop error message being displayed **/
                            clearTimeout(instagramRequestTimeout);
                            console.log(data);
                        }
                    } else {
                        /** In case of no data being returned from Instagram **/
                        iWContent = '<div id="content">' + restaurantName + '<p>' + 'No pictures found on Instagram...' + '</p>' + '</div>';
                        console.log(instagramURL);
                        infoWindow.setContent(iWContent);
                    }
                });

                /** End Ajax request **/

                toggleBounce(restaurant.marker);
                infoWindow.open(map, this);

            }); /** End listener **/

        }); /** End building markers **/

        /** Make the marker bounce for a set duration **/
        function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1450);
            }
        }

        /** Event trigger bound to the sidebar list, triggers the marker click event **/
        self.showWindows = function(restaurant) {
            google.maps.event.trigger(restaurant.marker, 'click');
        };

        /** Filter funcionality **/
        /** Technique from http://codepen.io/prather-mcs/pen/KpjbNN?editors=001 **/


        /** First, sort restaurantList array so the restaurants show alphabetically in the list **/
        self.restaurantList.sort(function(left, right) {
            return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1);
        });

        /** Array contains all markers currently visible: they can be filtered out **/
        self.visibleRestaurants = ko.observableArray([]);

        self.restaurantList().forEach(function(restaurant) {
            self.visibleRestaurants.push(restaurant);
        });

        /** Makes the input box an observable, keeping us aware of what the user has typed **/
        self.userInput = ko.observable('');

        /** Looks at the soup types the markers stand for, and the user input.
        If the user input matches a soup type, those restaurants remain visible.
        Other markers are removed. **/
        self.filterMarkers = function() {
            var searchInput = self.userInput().toLowerCase();
            /** Empty the array of visible restaurants. **/
            self.visibleRestaurants.removeAll();

            /** This looks at the soup type of each restaurant and then determines if the user
             input can be found within the soup type. Pushes those restaurants back into visibles **/
            self.restaurantList().forEach(function(restaurant) {
                restaurant.marker.setVisible(false);
                if (restaurant.soupType.toLowerCase().indexOf(searchInput) !== -1) {
                    self.visibleRestaurants.push(restaurant);
                }
            });

            self.visibleRestaurants().forEach(function(restaurant) {
                restaurant.marker.setVisible(true);
            });
        };

        /** Function used when Google Maps API fails to load **/
        function googleError() {
            $("#map").append("<p>Oops... Google Maps failed to load</p>");
        }

    }; /** End ViewModel **/

    ko.applyBindings(new viewModel());
} /** End initMap **/


/** API Keys
Google API key AIzaSyCr492h5nUEKHElF9GxEq_fie2z3c478nY
Instagram API key (Access token) 379669.1fb234f.9116b984edae498289e20991c57994c6
**/