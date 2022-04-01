/**
 * Created by f on 2021/11/24.
 */
var originTerminal, destinationTerminal, OriginMarker, DestinationMarker;
var GoogleMap = (function (exports) {
  var geocoder, newBoundary,directionsService,directionsRenderer,directionsLine;

  var privatemarkers = [];
  var originTerminalmarker =null;
  var destinationTerminalmarker =null;

  function init() {
    geocoder = new google.maps.Geocoder();
    newBoundary = new google.maps.LatLngBounds();
    directionsService = new google.maps.DirectionsService;
    directionsRenderer = new google.maps.DirectionsRenderer;
    directionsLine = new google.maps.Polyline;
    return new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(41.85, -87.65),
      zoom: 10,
      styles: [
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ],
    });

  }

  function geocode(request, callback) {
    geocoder
    .geocode(request)
    .then(function (result) {
      callback(result, request);
    })
  }

  function setMarkers(markers) {
    clearMarkers();
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      const marker = new google.maps.Marker({
        position: {lat: markers[i]['lat'], lng: markers[i]['lng']},
        icon: svgMarker(markers[i]['state']),
        title: markers[i]['state'],
        label:  {
          text: markers[i]['location_city'],
          color: '#ffffff',
          fontSize:'10px',
          className: 'marker-position',
        },
        map: map,
        cursor: 'map',
        optimized: true,
        zIndex: 1000,
      });
      privatemarkers.push(marker);
    }
    _.forEach(privatemarkers, function (marker) {
      newBoundary.extend(marker.position);
      google.maps.event.addListener(marker, "click", function (event) {
        clickMarker(event,marker,callbackfun);
      });
      google.maps.event.addListener(marker, "mouseover", function (event) {
        if(marker.getIcon().strokeColor != '#f9a580'){
          marker.setIcon(svgMarker('continuous'));
        }

      });

      google.maps.event.addListener(marker, "mouseout", function (event) {
        if(marker.getIcon().strokeColor != '#f9a580'){
          marker.setIcon(svgMarker('finish'));
        }

      });
    });
    map.setCenter(newBoundary.getCenter());
    map.fitBounds(newBoundary);
  }

  function callbackfun(marker, markerName) {
    if(markerName == 'clearClick'){
      destinationTerminalmarker.setIcon(svgMarker('finish'));
      originTerminalmarker.setIcon(svgMarker('finish'));
      return;
    }
    if(markerName == 'Origin'){
      originTerminalmarker = marker;
      marker.setIcon(svgMarker('contclick'));
      originTerminalmarker.setIcon(svgMarker('contclick'));
      return;
    }
    if(markerName == 'Destination'){
      destinationTerminalmarker = marker;
      marker.setIcon(svgMarker('contclick'));
      destinationTerminalmarker.setIcon(svgMarker('contclick'));
      return;
    }

  }

  function clearDirectionsRenderer() {
    directionsRenderer.setMap(null);
    directionsLine.setMap(null);
  }

  function funDirectionsService(originLo,destinationLo){
    if (directionsRenderer && directionsRenderer != undefined) {
      directionsRenderer.setMap(null);
    }
    if (directionsLine && directionsLine != undefined) {
      directionsLine.setMap(null);
    }
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      polylineOptions:{
        strokeColor: "rgba(0,0,0,0)",
        strokeOpacity: 0,
      },
      draggable: false,
      hideRouteList: false,
      preserveViewport: false,
      suppressBicyclingLayer: false,
      suppressMarkers: true,
      suppressInfoWindows: false
    });
    directionsService.route({
      origin: originLo.position,
      destination: destinationLo.position,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidFerries: true,
      avoidTolls: true,
      optimizeWaypoints: false,
      durationInTraffic: true,
      avoidHighways: true,
    }, function(result) {
      directionsRenderer.setDirections(result);
    });
    const lineSymbol = {
      path:"M 0,-1 0,1",
      fillColor:"#D63933",
      strokeOpacity: 1,
      scale: 2,
    };

    directionsLine = new google.maps.Polyline({
      path: [
        originLo.position,
        destinationLo.position,
      ],
      strokeColor: "#D63933",
      strokeOpacity: 0,
      strokeWeight: 2,
      geodesic: true,
      editable: false,
      zIndex:0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "20px",
        },
      ],
      map: map,
    });
  };

  function setOriginMarker(marker) {
    originTerminal = marker;
    OriginMarker = new google.maps.Marker({
      position: {lat: marker['lat'], lng: marker['lng']},
      icon: svgMarker(marker['state']),
      title: marker['state'],
      map: map,
      cursor: 'map',
      optimized: true,
      zIndex: 1001,
    });
    if(OriginMarker && DestinationMarker) funDirectionsService(OriginMarker, DestinationMarker);
  }

  function setDestinationMarker(marker) {
    destinationTerminal = marker;
    DestinationMarker = new google.maps.Marker({
      position: {lat: marker['lat'], lng: marker['lng']},
      icon: svgMarker(marker['state']),
      title: marker['state'],
      map: map,
      cursor: 'map',
      optimized: true,
      zIndex: 1001,
    });
    if(OriginMarker && DestinationMarker) funDirectionsService(OriginMarker, DestinationMarker);
  }


  function clearMarkers() {
    for (var i = 0; i < privatemarkers.length; i++) {
      privatemarkers[i].setMap(null);
    }
    privatemarkers = [];
  }


  function clearOriginMarker() {
    OriginMarker.setMap(null);
    OriginMarker = null;
  }

  function clearDestinationMarker() {
    DestinationMarker.setMap(null);
    DestinationMarker = null;
  }

  function svgMarker(state) {
    if (state == 'finish') return {
      path: "M14.7,7.4c0,4.1-3.4,7.4-7.4,7.4S0,11.5,0,7.4S3.4,0,7.4,0S14.7,3.2,14.7,7.4z",
      strokeColor: "rgba(255,255,255,0)",
      fillColor: "#D63933",
      fillOpacity: 1,
      strokeWeight:6,
      rotation: 2,
      scale: 1,
      anchor: new google.maps.Point(7, 7),
      labelOrigin: new google.maps.Point(-60, 10),
    };

    if (state == 'continuous') return {
      path: "M14.7,7.4c0,4.1-3.4,7.4-7.4,7.4S0,11.5,0,7.4S3.4,0,7.4,0S14.7,3.2,14.7,7.4z",
      strokeColor: "#f99d75",
      fillColor: "#D63933",
      fillOpacity: 1,
      strokeWeight: 6,
      rotation: 2,
      scale: 1,
      anchor: new google.maps.Point(7, 7),
      labelOrigin: new google.maps.Point(-60, 10),
    };
    if (state == 'contclick') return {
      path: "M14.7,7.4c0,4.1-3.4,7.4-7.4,7.4S0,11.5,0,7.4S3.4,0,7.4,0S14.7,3.2,14.7,7.4z",
      strokeColor: "#f9a580",
      fillColor: "#D63933",
      fillOpacity: 1,
      strokeWeight: 6,
      rotation: 2,
      scale: 1,
      anchor: new google.maps.Point(7, 7),
      labelOrigin: new google.maps.Point(-60, 10),
    };
    if (state == 'Origin') return {
      path: "M11.7,0C5.2,0,0,5.2,0,11.7c0,8.8,11.7,21.7,11.7,21.7s11.7-12.9,11.7-21.7C23.3,5.2,18.1,0,11.7,0z M15.5,13.4 l-3.2-3.2v8.5H11v-8.5l-3.2,3.2l-1-1l4.9-4.9l4.9,4.9L15.5,13.4z",
      fillColor: "#D63933",
      strokeColor: "#FFFFFF",
      fillOpacity: 1,
      strokeWeight: 1,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(12, 42),
    };
    if (state == 'Destination') return {
      path: "M11.7,0C5.2,0,0,5.2,0,11.7c0,8.8,11.7,21.7,11.7,21.7s11.7-12.9,11.7-21.7C23.3,5.2,18.1,0,11.7,0z M11.7,17.6 l-4.9-4.9l1-1l3.2,3.2V6.5h1.4v8.5l3.2-3.2l1,1L11.7,17.6z",
      fillColor: "#D63933",
      strokeColor: "#FFFFFF",
      fillOpacity: 1,
      strokeWeight: 1,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(12, 42),
    };
  }

  exports.init = init;
  exports.setMarkers = setMarkers;
  exports.setOriginMarker = setOriginMarker;
  exports.setDestinationMarker = setDestinationMarker;
  exports.clearMarkers = clearMarkers;
  exports.clearOriginMarker = clearOriginMarker;
  exports.clearDestinationMarker = clearDestinationMarker;
  exports.geocode = geocode;
  exports.funDirectionsService = funDirectionsService;
  exports.clearDirectionsRenderer = clearDirectionsRenderer;
  exports.svgMarker = svgMarker;
  return exports;
}({}));