clickMarker = function (event, marker, callback) {
  if (moudleName.value == 'transitTimes') {
    doNotService.value = null;
    if (OriginMarker && DestinationMarker) {
      state.originZipCode = '';
      state.destinationZipCode = '';
      originTerminal = null;
      destinationTerminal = null;
      transitOriginTerminal.value = null;
      transitDestinationTerminal.value = null;
      googleMap.clearOriginMarker();
      googleMap.clearDestinationMarker();
      googleMap.clearDirectionsRenderer();
      doNotService.value = null;
      callback(marker,'clearClick');
    }
    var pickTerminal = _.find(allTerminals, {'lat': event.latLng.lat(), 'lng': event.latLng.lng()});
    if (!pickTerminal) return;
    if (!OriginMarker) {
      state.originZipCode = pickTerminal.location_zip;
      pickTerminal.state = 'Origin';
      originTerminal = pickTerminal;
      googleMap.geocode({address: pickTerminal.location_zip}, function (results) {
        mapAddress(results, 'Origin');
      });
      googleMap.setOriginMarker(pickTerminal);
      transitOriginTerminal.value = pickTerminal;
      isTermials.value = true;
      callback(marker,'Origin');
      return;
    }
    if (!DestinationMarker) {
      state.destinationZipCode = pickTerminal.location_zip;
      pickTerminal.state = 'Destination';
      destinationTerminal = pickTerminal;
      googleMap.geocode({address: pickTerminal.location_zip}, function (results) {
        mapAddress(results, 'Destination');
      });
      googleMap.setDestinationMarker(pickTerminal);
      transitDestinationTerminal.value = pickTerminal;
      isTermials.value = true;
      callback(marker,'Destination');
      return;
    }
  }
};

var calculateTransitTime = function () {
  getTerminal();
};

var state = Vue.reactive({
  originZipCode: '',
  destinationZipCode: '',
});

var transitTime = Vue.reactive({
  day: '',
  from: '',
  to: '',
});
var doNotService = Vue.ref();
var provieIsTermials = Vue.ref();
var transitOriginTerminal = Vue.ref();
var transitDestinationTerminal = Vue.ref();

var originOrDestinationAddress = Vue.reactive({
  Origin: '',
  Destination: '',
});


var openGoogleMapApp = function (zip) {
  if(transitOriginTerminal._value.location_zip && !transitDestinationTerminal._value.location_zip){
    window.location.href = "https://www.google.com/maps/dir/?api=1&origin="+transitOriginTerminal._value.location_zip
  }if(!transitOriginTerminal._value.location_zip && transitDestinationTerminal._value.location_zip){
    window.location.href = "https://www.google.com/maps/dir/?api=1&destination="+transitDestinationTerminal._value.location_zip
  }if(transitOriginTerminal._value.location_zip && transitDestinationTerminal._value.location_zip){
    window.location.href = "https://www.google.com/maps/dir/?api=1&origin="+transitOriginTerminal._value.location_zip+"&destination=" + transitDestinationTerminal._value.location_zip;
  }
}

var clearDestination = function () {
  state.originZipCode = '';
  state.destinationZipCode = '';
  originOrDestinationAddress.Origin = '';
  originOrDestinationAddress.Destination = '';
  doNotService.value = null;
  googleMap.clearMarkers();
  if (OriginMarker) googleMap.clearOriginMarker();
  if (DestinationMarker) googleMap.clearDestinationMarker();
  googleMap.clearDirectionsRenderer();
  isTermials.value = false;
  transitOriginTerminal.value = null;
  transitDestinationTerminal.value = null;
  getTerminal();
};


function toggleOriginDestination() {
  var originZipCode = _.clone(state.originZipCode);
  var destinationZipCode = _.clone(state.destinationZipCode);
  var cloneOriginTerminal = _.cloneDeep(originTerminal);
  var cloneDestinationTerminal = _.cloneDeep(destinationTerminal);
  var cloneTransitOriginTerminal = _.cloneDeep(transitOriginTerminal);
  var cloneTransitDestinationTerminal = _.cloneDeep(transitDestinationTerminal);
  var cloneOriginOrDestinationAddressOrigin = _.cloneDeep(originOrDestinationAddress.Origin);
  var cloneOriginOrDestinationAddressDestination = _.cloneDeep(originOrDestinationAddress.Destination);
  state.destinationZipCode = originZipCode ? originZipCode : '';
  state.originZipCode = destinationZipCode ? destinationZipCode : '';
  destinationTerminal = cloneOriginTerminal ? cloneOriginTerminal : null;
  originTerminal = cloneDestinationTerminal ? cloneDestinationTerminal : null;
  originOrDestinationAddress.Origin = cloneOriginOrDestinationAddressDestination;
  originOrDestinationAddress.Destination = cloneOriginOrDestinationAddressOrigin;
  if (cloneTransitDestinationTerminal._value && cloneTransitOriginTerminal._value) {
    transitDestinationTerminal.value = cloneTransitOriginTerminal._value;
    transitOriginTerminal.value = cloneTransitDestinationTerminal._value;
  }
  if (cloneTransitOriginTerminal._value && !cloneTransitDestinationTerminal._value) {
    transitDestinationTerminal.value = cloneTransitOriginTerminal._value;
    transitOriginTerminal.value = null;
  }
  if (cloneTransitDestinationTerminal._value && !cloneTransitOriginTerminal._value) {
    transitOriginTerminal.value = cloneTransitDestinationTerminal._value;
    transitDestinationTerminal.value = null;
  }

  if (OriginMarker && DestinationMarker) {
    OriginMarker.setPosition({
      lat: cloneDestinationTerminal.lat,
      lng: cloneDestinationTerminal.lng
    });
    DestinationMarker.setPosition({
      lat: cloneOriginTerminal.lat,
      lng: cloneOriginTerminal.lng
    });
    return;
  }

  if (DestinationMarker && !OriginMarker) {
    var markerData = {
      lat: cloneDestinationTerminal.lat,
      lng: cloneDestinationTerminal.lng,
      state: 'Origin',
      label: 'Terminal',
    };
    googleMap.setOriginMarker(markerData);
    destinationTerminal = null;
    googleMap.clearDestinationMarker();
  }

  if (OriginMarker && !DestinationMarker) {
    var markerData = {
      lat: cloneOriginTerminal.lat,
      lng: cloneOriginTerminal.lng,
      state: 'Destination',
      label: 'Terminal',
    };
    googleMap.setDestinationMarker(markerData);
    originTerminal = null;
    googleMap.clearOriginMarker();
  }

}


var transitTimesCalculateTransitTimes = function () {
  transitDay({
    from: state.originZipCode,
    to: state.destinationZipCode
  });
};


var getToQuote = function () {
  window.open("https://ship.unisco.com/v2/index.html");
};

function mapAddress(results, name) {
  doNotService.value = null;
  if (!results.results[0]) return;
  originOrDestinationAddress[name] =results.results[0].formatted_address.substring(0, results.results[0].formatted_address.lastIndexOf(',')) ;
}

const TransitTimes = {
  template: '#TransitTimes',
  setup() {
    watch(originOrDestinationAddress, function (vaule) {
      if (!vaule.Origin && !vaule.Destination) isTermials.value = false;
      else  isTermials.value = true;
    });

    onMounted(function () {
      state.originZipCode = '';
      state.destinationZipCode = '';
      const originZipCodeInput = document.getElementById("originZipCode");
      Rx.Observable.fromEvent(originZipCodeInput, 'input')
      .pluck('target', 'value')
      .debounceTime(1000)
      .subscribe(function (searchKey) {
          if (OriginMarker) googleMap.clearOriginMarker();
          if (!searchKey) return;
          if (!isNaN(Number(searchKey)) && searchKey.length == 5) {
            googleMap.geocode({address: searchKey}, function (results) {
              mapAddress(results, 'Origin');
            });
            getTerminal({zip: searchKey}, 'Origin');
          }

        }
      );

      const destinationZipCodeInput = document.getElementById("destinationZipCode");
      Rx.Observable.fromEvent(destinationZipCodeInput, 'input')
      .pluck('target', 'value')
      .debounceTime(1000)
      .subscribe(function (searchKey) {
          if (DestinationMarker) googleMap.clearDestinationMarker();
          if (!searchKey) return;
          if (!isNaN(Number(searchKey)) && searchKey.length == 5) {
            googleMap.geocode({address: searchKey}, function (results) {
              mapAddress(results, 'Destination');
            });
            getTerminal({zip: searchKey}, 'Destination');
          }


        }
      );
    });

    return {
      state,
      transitTime,
      transitOriginTerminal,
      transitDestinationTerminal,
      calculateTransitTime,
      clearDestination,
      toggleOriginDestination,
      transitTimesCalculateTransitTimes,
      doNotService,
      provieIsTermials,
      getToQuote,
      originOrDestinationAddress,
      openGoogleMapApp
    }
  }
};

