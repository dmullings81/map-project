function initMap() {

            var mapOptions = {
               center:new google.maps.LatLng(35.653296, 138.557487),
               zoom:14,
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),mapOptions);

            var markers = [
            	['Hanedaya Ramen', 35.641980, 138.543689],
            	['Shoshi Kantentsu Ramen', 35.652693, 138.561918 ]
            ]

            // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Hanedaya Ramen</h3>' +
        '<p>Shoyutonkotsu ramen.</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Shoshi Kantentsu Ramen</h3>' +
        '<p>Miso ramen.</p>' +
        '</div>']
    ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        //bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: markers[i][0]
        });


        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
				toggleBounce(marker);
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);

            }
        })(marker, i));
         }

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