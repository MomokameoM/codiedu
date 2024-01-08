$(document).ready(function(){
    /***** Mapa de GoogleMaps del Instituto *****/
    var map;
    function initialize() {
        var myLatlng = new google.maps.LatLng(19.453952651706953, -99.17500764005172);
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(19.453952651706953, -99.17500764005172),
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        map = new google.maps.Map(document.getElementById('mapa-ins'),
            mapOptions);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'CECyT 9'
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);


});