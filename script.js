'use strict';

const getPosition = function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude: lat, longitude: long } = position.coords;
    console.log(lat, long);

    const map = L.map('map').setView([lat, long], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    const greyIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const popup = L.popup({
      maxWidth: 250,
      minWidth: 100,
      className: 'popup',
    }).setContent('My workout');

    L.marker([lat, long], { icon: greyIcon })
      .addTo(map)
      .bindPopup(popup)
      .openPopup();
  });
};

getPosition();
