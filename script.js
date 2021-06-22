const form = document.querySelector('form');

class Workout {
  #date = new Date();
  #id = this.#date.getTime().toString().split('').slice(-10).join('');
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, long]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  calcSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    return this.speed;
  }
}

class Jogging extends Workout {
  type = 'jogging';
  constructor(coords, distance, duration) {
    super(coords, distance, duration);
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration) {
    super(coords, distance, duration);
  }
}

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
  }

  _getPosition = function () {
    navigator.geolocation.getCurrentPosition(
      // position coming from the geolocation is passed automatically
      this._loadMap.bind(this),
      function () {
        alert('Error: location cannot be set');
      }
    );
  };

  _loadMap = function (position) {
    const { latitude: lat, longitude: long } = position.coords;

    this.#map = L.map('map').setView([lat, long], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);

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
      .addTo(this.#map)
      .bindPopup(popup)
      .openPopup();

    this.#map.on('click', this._showForm.bind(this));
  };

  _showForm(e) {
    this.#mapEvent = e;
    const { lat, lng } = e.latlng;
    console.log(lat, lng);

    form.classList.remove('form--hidden');
  }
}

const app = new App();

// const workout = new Workout(222, 5, 40);
// console.log(workout);

// const jogging = new Jogging(222, 1, 5);
// console.log(jogging.calcSpeed());

// const cycling = new Cycling(333, 2, 10);
// console.log(cycling.calcSpeed());
